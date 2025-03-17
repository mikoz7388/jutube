import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TUMBNAIL_FALLBACK } from "@/modules/videos/constatns";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
  title: string;
  videoCount: number;
  className?: string;
  imageUrl?: string | null;
}

export function PlaylistThumbnailSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Skeleton className="size-full" />
    </div>
  );
}

export function PlaylistThumbnail({
  title,
  videoCount,
  className,
  imageUrl,
}: PlaylistThumbnailProps) {
  const compactViedeoCount = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(videoCount);
  }, [videoCount]);

  return (
    <div className={cn("relative pt-3", className)}>
      <div className="relative">
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20" />
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25" />
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl ?? TUMBNAIL_FALLBACK}
            alt={title}
            className="h-full w-full object-cover"
            fill
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="size-4 fill-white text-white" />
              <span className="font-medium text-white">Play all</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        <ListVideoIcon className="size-4" />
        {compactViedeoCount} videos
      </div>
    </div>
  );
}
