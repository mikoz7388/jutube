"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/video-player";
import VideoBanner from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";

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
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

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
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={"waiting"} />
      <VideoTopRow video={video} />
    </>
  );
};
