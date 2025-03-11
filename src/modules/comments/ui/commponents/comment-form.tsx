import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";

interface CommentformProps {
  videoId: string;
  onSuccess?: () => void;
}

export function CommentForm({ videoId, onSuccess }: CommentformProps) {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <form className="group flex gap-4">
      <UserAvatar
        size="lg"
        imageUrl={user?.image}
        name={user?.name ?? "User"}
      />
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          className="min-h-0 resize-none overflow-hidden bg-transparent"
        />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="submit" size="sm">
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
}
