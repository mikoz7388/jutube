import { HistoryVideosSection } from "../sections/history-videos-section";

export function HistoryView() {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p>Videos you have already watched</p>
      </div>
      <HistoryVideosSection />
    </div>
  );
}
