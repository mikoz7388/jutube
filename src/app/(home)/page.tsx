import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { HomeVideosSection } from "@/modules/home/ui/sections/home-videos-section";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({
    categoryId,
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
      <HomeVideosSection categoryId={categoryId} />
    </HydrateClient>
  );
}
