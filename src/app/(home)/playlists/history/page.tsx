import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { HistoryView } from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.playlists.getHistory.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
}
