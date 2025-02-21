import { CategoriresSection } from "../sections/categories-section";

interface HomeViewProps {
  categoryId?: string;
}

export function HomeView({ categoryId }: HomeViewProps) {
  return (
    <div className="pt2.5 mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4">
      <CategoriresSection categoryId={categoryId} />
    </div>
  );
}
