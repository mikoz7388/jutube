import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoThumbnail } from "./video-thumbnail";
import { VideoInfo } from "./video-info";

interface VideoGridCardProps {
  data: VideoGetManyOutput["data"][number];
  onRemove?: () => void;
}

export function VideoGridCard({ data, onRemove }: VideoGridCardProps) {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/videos/${data.id}`}>
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
