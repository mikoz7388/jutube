import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { VideosView } from "@/modules/playlists/ui/views/videos-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ id: playlistId });
  void trpc.playlists.getCustom.prefetchInfinite({
    playlistId,
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
}
