"use client";

import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../components/video-row-card";

interface SuggestionsSectionProps {
  videoId: string;
}

export function SuggestionsSection({ videoId }: SuggestionsSectionProps) {
  const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  return (
    <div>
      <h2>Suggestions</h2>
      {suggestions.pages.flatMap((page) =>
        page.data.map((video) => (
          <VideoRowCard key={video.id} data={video} size="compact" />
        )),
      )}
    </div>
  );
}
