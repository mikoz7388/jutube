"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface VideosSectionProps {
  playlistId: string;
}

export function VideosSection(props: VideosSectionProps) {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}

function VideosSectionSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} size="compact" />
        ))}
      </div>
    </>
  );
}

function VideosSectionSuspense({ playlistId }: VideosSectionProps) {
  const [videos, query] = trpc.playlists.getCustom.useSuspenseInfiniteQuery(
    { limit: DEFAULT_INFINITE_QUERY_LIMIT, playlistId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const utils = trpc.useUtils();

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast({ title: "Video removed from playlist" });
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getCustom.invalidate({ playlistId: data.playlistId });
    },
    onError: (e) => {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: e.message,
      });
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.data)
          .map((video) => (
            <VideoGridCard
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
              key={video.id}
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.data)
          .map((video) => (
            <VideoRowCard
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
              key={video.id}
              size="compact"
            />
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
      />
    </div>
  );
}
