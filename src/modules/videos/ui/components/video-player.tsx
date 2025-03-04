import MuxPlayer from "@mux/mux-player-react";
import { TUMBNAIL_FALLBACK } from "../../constatns";
interface VideoPlayerProps {
  playbackId?: string | null;
  thumbnailUrl?: string | null;
  autoplay?: boolean;
  onPlay?: () => void;
}

export function VideoPlayer({
  autoplay,
  onPlay,
  playbackId,
  thumbnailUrl,
}: VideoPlayerProps) {
  return (
    <MuxPlayer
      playbackId={playbackId ?? ""}
      poster={thumbnailUrl ?? TUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoplay}
      thumbnailTime={0}
      className="h-full w-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
}
