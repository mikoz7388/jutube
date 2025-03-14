"use client";

import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export function SuggestionsSection({
  videoId,
  isManual,
}: SuggestionsSectionProps) {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Kłopoty najmana</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
}
export function SuggestionsSectionSkeleton() {
  return (
    <>
      <div className="hidden space-y-3 md:block">
        {Array.from({ length: 7 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} size="compact" />
        ))}
      </div>
      <div className="block space-y-10 md:hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export function SuggestionsSectionSuspense({
  videoId,
  isManual,
}: SuggestionsSectionProps) {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  return (
    <>
      <div className="hidden space-y-3 md:block">
        <h2>Suggestions</h2>
        {suggestions.pages.flatMap((page) =>
          page.data.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          )),
        )}
      </div>
      <div className="block space-y-3 md:hidden">
        <h2>Suggestions</h2>
        {suggestions.pages.flatMap((page) =>
          page.data.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
}
