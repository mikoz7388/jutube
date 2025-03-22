import { UserAvatar } from "@/components/user-avatar";
import { SubscribeButton } from "./subscribe-button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string | null;
  subscriberCount: number;
  onUnsubscribe: () => void;
  disabled: boolean;
}

export function SubscriptionItemSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SubscriptionItem({
  disabled,
  imageUrl,
  name,
  onUnsubscribe,
  subscriberCount,
}: SubscriptionItemProps) {
  return (
    <div className="flex gap-4">
      <UserAvatar name={name} imageUrl={imageUrl} size="lg" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm"> {name}</h3>
            <p className="text-xs text-muted-foreground">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>
          <SubscribeButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
}
