"use client";

import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export function SuggestionsSection({
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
