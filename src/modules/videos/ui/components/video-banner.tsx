import React from "react";
import { VideoGetOneOutput } from "../../types";
import { AlertTriangleIcon } from "lucide-react";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  status,
}: VideoBannerProps) => {
  if (status === "ready") return null;

  return (
    <div className="flex items-center gap-2 rounded-b-xl bg-yellow-500 px-4 py-3">
      <AlertTriangleIcon className="size-4 shrink-0 text-black" />
      <p className="line-clamp-1 text-xs font-medium text-black md:text-sm">
        This video is still being processed.
      </p>
    </div>
  );
};

export default VideoBanner;
