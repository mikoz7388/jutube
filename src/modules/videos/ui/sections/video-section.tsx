"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/video-player";
import VideoBanner from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";
import { authClient } from "@/lib/auth-client";

interface VideosSectionProps {
  videoId: string;
}

export function VideosSection({ videoId }: VideosSectionProps) {
  return (
    <Suspense fallback={<p>loadin</p>}>
      <ErrorBoundary fallback={<p>error </p>}>
        <VideosSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const VideosSectionSuspense = ({ videoId }: VideosSectionProps) => {
  const user = authClient.useSession();

  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });

  const handlePlay = () => {
    if (!user.data?.session) return;

    createView.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none",
        )}
      >
        <VideoPlayer
          autoplay
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={"waiting"} />
      <VideoTopRow video={video} />
    </>
  );
};
