"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export function ResultsSection({ categoryId, query }: ResultsSectionProps) {
  const isMobile = useIsMobile();
  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    { query, categoryId, limit: DEFAULT_INFINITE_QUERY_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.data)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.data)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        fetchNextPage={resultsQuery.fetchNextPage}
        hasNextPage={resultsQuery.hasNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
      />
    </>
  );
}
