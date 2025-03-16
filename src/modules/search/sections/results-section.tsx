"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
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

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}
export function ResultsSection(props: ResultsSectionProps) {
  return (
    <Suspense
      key={`${props.query}-${props.categoryId}`}
      fallback={<ResultsSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>err</p>}>
        <ResultsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}

export function ResultsSectionSkeleton() {
  return (
    <>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-4 gap-y-10 p-4 pt-6 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

function ResultsSectionSuspense({ categoryId, query }: ResultsSectionProps) {
  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    { query, categoryId, limit: DEFAULT_INFINITE_QUERY_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {results.pages
          .flatMap((page) => page.data)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>

      <div className="hidden flex-col gap-4 gap-y-10 md:flex">
        {results.pages
          .flatMap((page) => page.data)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} />
          ))}
      </div>

      <InfiniteScroll
        fetchNextPage={resultsQuery.fetchNextPage}
        hasNextPage={resultsQuery.hasNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
      />
    </>
  );
}
