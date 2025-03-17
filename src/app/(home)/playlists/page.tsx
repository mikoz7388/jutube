import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page() {
  void trpc.playlists.getMany.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
}
