import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
}

export function CommentItem({ comment }: CommentItemProps) {
  const user = authClient.useSession().data?.user;

  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast({ title: "Comment deleted successfully" });
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast({ title: "Error deleting comment", description: error.message });
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar name={comment.user.name} size="lg" imageUrl={comment.user.image} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <Link href={`/users/${comment.userId}`}>
              <span className="pb-0.5 text-sm font-medium">{comment.user.name}</span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm">{comment.value}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.user.id === user?.id ? (
              <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
