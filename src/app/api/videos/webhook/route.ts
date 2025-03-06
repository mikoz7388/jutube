import { db } from "@/db";
import { videos } from "@/db/schema/videos";
import { mux } from "@/lib/mux";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";

const SIGNINIG_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNINIG_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is missing");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("Signature missing", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    { "mux-signature": muxSignature },
    SIGNINIG_SECRET,
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      await db
        .update(videos)
        .set({ muxAssetId: data.id, muxStatus: data.status })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      if (!playbackId) {
        return new Response("Missing playback id", { status: 400 });
      }

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }
      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
          thumbnailUrl: videos.thumbnailUrl,
          previewUrl: videos.previewUrl,
          previewKey: videos.previewKey,
        })
        .from(videos)
        .where(eq(videos.muxUploadId, data.upload_id));

      if (!existingVideo.thumbnailKey || !existingVideo.previewKey) {
        const utapi = new UTApi();
        const [uploadedThumbnailUrl, uploadedPreviewUrl] =
          await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

        if (!uploadedThumbnailUrl.data || !uploadedPreviewUrl.data) {
          return new Response("Failed to upload thumbnail or preview", {
            status: 500,
          });
        }

        existingVideo.previewKey = uploadedPreviewUrl.data.key;
        existingVideo.previewUrl = uploadedPreviewUrl.data.ufsUrl;

        existingVideo.thumbnailKey = uploadedThumbnailUrl.data.key;
        existingVideo.thumbnailUrl = uploadedThumbnailUrl.data.ufsUrl;
      }
      //TODO i do not like this
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl: existingVideo.thumbnailUrl,
          thumbnailKey: existingVideo.thumbnailKey,
          previewUrl: existingVideo.previewUrl,
          previewKey: existingVideo.previewKey,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }
      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      const assetId = (data.asset_id = data.asset_id);
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset Id", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};
