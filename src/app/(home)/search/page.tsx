import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ query: string; categoryId: string | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { categoryId, query } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    categoryId,
    query,
    limit: DEFAULT_INFINITE_QUERY_LIMIT,
  });

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
}
