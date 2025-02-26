"use client";

import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";

export function VideosSection() {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  return <div>{JSON.stringify(data)}</div>;
}
