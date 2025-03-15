import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { SubscribedView } from "@/modules/home/ui/views/subscribed-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
}
