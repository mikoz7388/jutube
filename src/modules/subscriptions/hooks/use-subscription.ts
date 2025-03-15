import { toast } from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  isSubscribed,
  userId,
  fromVideoId,
}: UseSubscriptionProps) => {
  const utils = trpc.useUtils();
  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast({ title: "Subscribed" });
      utils.videos.getManySubscribed.invalidate();
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: () => {
      toast({ title: "Something went wrong", variant: "destructive" });
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast({ title: "Subscribed" });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: () => {
      toast({ title: "Something went wrong", variant: "destructive" });
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (!isSubscribed) {
      subscribe.mutate({ userId });
    } else {
      unsubscribe.mutate({ userId });
    }
  };

  return { isPending, onClick };
};
