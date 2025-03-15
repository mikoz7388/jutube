import { TrendingVideosSection } from "../sections/trending-videos-section";

export function TrendingView() {
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Trending</h1>
        <p>Most popular videos at the moment</p>
      </div>
      <TrendingVideosSection />
    </div>
  );
}
