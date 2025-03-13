import { formatDistanceToNow } from "date-fns";
import { VideoGetManyOutput } from "../../types";
import { useMemo } from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoMenu } from "./video-menu";

interface VideoInfoProps {
  data: VideoGetManyOutput["data"][number];
  onRemove?: () => void;
}

export function VideoInfo({ data, onRemove }: VideoInfoProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-2">
      <Link href={`/users/${data.user.image}`}>
        <UserAvatar imageUrl={data.user.image} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="line-clamp-1 break-words text-base font-medium lg:line-clamp-2">
            {data.title}
          </h3>
        </Link>
        <Link href={`/users/${data.user.image}`}>
          <UserInfo name={data.user.name} />
        </Link>
        <Link href={`/videos/${data.id}`}>
          <p className="line-clamp-1 text-sm text-gray-600">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
}
