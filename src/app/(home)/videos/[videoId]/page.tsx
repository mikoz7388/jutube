import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ videoId: string }>;
}
export default async function Page({ params }: PageProps) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
