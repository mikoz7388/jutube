import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";

import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/modules/subscriptions/ui/components/subscribe-button";
import { authClient } from "@/lib/auth-client";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export function VideoOwner({ user, videoId }: VideoOwnerProps) {
  const { data: session } = authClient.useSession();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.image ?? undefined}
            name={user.name}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="lg" name={user.name} />
            <span className="line-clamp-1 text-sm text-muted-foreground">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {session?.user.id === user.id ? (
        <Button asChild className="rounded-full" variant="secondary">
          <Link prefetch href={`/studio/videos/${videoId}`}>
            {" "}
            Edit video
          </Link>
        </Button>
      ) : (
        <SubscribeButton
          onClick={onClick}
          disabled={isPending}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
}
