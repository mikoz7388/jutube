import { VideosSection } from "@/modules/videos/ui/sections/video-section";
import { SuggestionsSection } from "../sections/suggestions-section";
import { CommentsSection } from "../sections/comments-section";

interface VideoViewProps {
  videoId: string;
}

export function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideosSection videoId={videoId} />
          <div className="mt-4 block xl:hidden">
            <SuggestionsSection videoId={videoId} />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden w-full xl:block xl:w-[380px] 2xl:w-[460px]">
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
