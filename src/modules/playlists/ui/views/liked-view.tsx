import { LikedVideosSection } from "../sections/liked-videos-section";

export function LikedView() {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Liked</h1>
        <p>Videos you have liked</p>
      </div>
      <LikedVideosSection />
    </div>
  );
}
