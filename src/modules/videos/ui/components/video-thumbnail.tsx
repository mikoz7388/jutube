import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { TUMBNAIL_FALLBACK } from "../../constatns";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoThumbnailProps {
  title: string;
  imageUrl?: string | null;
  previewUrl?: string | null;
  duration: number;
}

export function VideoThumbnailSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Skeleton className="size-full" />
    </div>
  );
}

export function VideoThumbnail({
  title,
  imageUrl,
  previewUrl,
  duration,
}: VideoThumbnailProps) {
  return (
    <div className="group relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl ?? TUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? TUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
