import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export function VideoReactions() {
  const viewerReaction = "like";
  return (
    <div className="flex flex-none items-center">
      <Button
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        variant="secondary"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        className="rounded-l-full rounded-r-none pl-3"
        variant="secondary"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction !== "like" && "fill-black")}
        />
        {6}
      </Button>
    </div>
  );
}
