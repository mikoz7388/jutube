import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoThumbnail, VideoThumbnailSkeleton } from "./video-thumbnail";
import { VideoInfo, VideoInfoSkeleton } from "./video-info";

interface VideoGridCardProps {
  data: VideoGetManyOutput["data"][number];
  onRemove?: () => void;
}

export function VideoGridCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
}

export function VideoGridCard({ data, onRemove }: VideoGridCardProps) {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link prefetch href={`/videos/${data.id}`}>
        <VideoThumbnail
          duration={data.duration}
          title={data.title}
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
}
