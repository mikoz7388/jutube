import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            name={comment.user.name}
            size="lg"
            imageUrl={comment.user.image}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <Link href={`/users/${comment.userId}`}>
              <span className="pb-0.5 text-sm font-medium">
                {comment.user.name}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm">{comment.value}</p>
        </div>
      </div>
    </div>
  );
}
