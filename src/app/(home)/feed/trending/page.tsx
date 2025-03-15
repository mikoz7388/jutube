import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  void trpc.videos.getTrending.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
