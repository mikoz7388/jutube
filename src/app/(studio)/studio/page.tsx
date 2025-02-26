import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
