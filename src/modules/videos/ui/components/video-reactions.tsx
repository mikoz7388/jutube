import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";

interface VideoReactionsProps {
  videoId: VideoGetOneOutput["id"];
  likes: VideoGetOneOutput["likeCount"];
  dislikes: VideoGetOneOutput["dislikeCount"];
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export function VideoReactions({
  dislikes,
  likes,
  videoId,
  viewerReaction,
}: VideoReactionsProps) {
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast({ title: "Something went wrong" });
      if (error.data?.code === "UNAUTHORIZED") {
        console.log("UNAUTHORIZED");
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast({ title: "Something went wrong" });
      if (error.data?.code === "UNAUTHORIZED") {
        console.log("UNAUTHORIZED");
      }
    },
  });

  return (
    <div className="flex flex-none items-center">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        variant="secondary"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="rounded-l-full rounded-r-none pl-3"
        variant="secondary"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
}
