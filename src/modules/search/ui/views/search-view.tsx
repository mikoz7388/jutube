import { CategoriresSection } from "../../sections/categories-section";
import { ResultsSection } from "../../sections/results-section";

interface PageProps {
  query: string;
  categoryId: string | undefined;
}

export function SearchView({ query, categoryId }: PageProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1300px] flex-col gap-y-6 px-4 pt-2.5">
      <CategoriresSection categoryId={categoryId} />
      <ResultsSection categoryId={categoryId} query={query} />
    </div>
  );
}
