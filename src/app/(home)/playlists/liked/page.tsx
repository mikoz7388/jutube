import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { LikedView } from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.playlists.getLiked.prefetchInfinite({
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
}
