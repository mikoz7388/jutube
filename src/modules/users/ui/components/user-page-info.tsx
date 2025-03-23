import { UserAvatar } from "@/components/user-avatar";
import { userGetOneOutput } from "../../types";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscribeButton } from "@/modules/subscriptions/ui/components/subscribe-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInfoProps {
  user: userGetOneOutput;
}

export function UserPageInfoSkeleton() {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="mt-1 h-4 w-48 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-full" />
      </div>

      <div className="hidden gap-4 md:flex">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-5 w-48" />
          <Skeleton className="mt-3 h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function UserPageInfo({ user }: UserPageInfoProps) {
  const auth = authClient.useSession();
  const currentUserId = auth.data?.user.id;
  const isLoaded = !!currentUserId;

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.image}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => -{}}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <span>{user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videosCount} videos</span>
            </div>
          </div>
        </div>
        {user.id === currentUserId ? (
          <Button
            variant="secondary"
            asChild
            className="mt-3 w-full rounded-full"
          >
            <Link prefetch href="/studio">
              Go to studio
            </Link>
          </Button>
        ) : (
          <SubscribeButton
            disabled={!isLoaded || isPending}
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
            className="mt-3 w-full"
          />
        )}
      </div>
      <div className="hidden items-start gap-4 md:flex">
        <UserAvatar
          size="xl"
          imageUrl={user.image}
          name={user.name}
          className={cn(
            currentUserId === user.id &&
              "cursor-pointer transition-opacity duration-300 hover:opacity-80",
          )}
          onClick={() => -{}}
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
            <span>{user.subscriberCount} subscribers</span>
            <span>&bull;</span>
            <span>{user.videosCount} videos</span>
          </div>
          {user.id === currentUserId ? (
            <Button variant="secondary" asChild className="mt-3 rounded-full">
              <Link prefetch href="/studio">
                Go to studio
              </Link>
            </Button>
          ) : (
            <SubscribeButton
              disabled={!isLoaded || isPending}
              isSubscribed={user.viewerSubscribed}
              onClick={onClick}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
}
