"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

export function SubscriptionsSection() {
  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <SubscriptionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function SubscriptionsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <SubscriptionItemSkeleton key={i} />
      ))}
    </div>
  );
}

function SubscriptionsSectionSuspense() {
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      { limit: DEFAULT_INFINITE_QUERY_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );
  const utils = trpc.useUtils();

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast({ title: "Unsubscribed" });
      utils.users.getOne.invalidate({ id: data.creatorId });
      utils.subscriptions.getMany.invalidate();
    },
    onError: () => {
      toast({ title: "Something went wrong", variant: "destructive" });
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {subscriptions.pages
          .flatMap((page) => page.data)
          .map((subscription) => (
            <Link
              href={`/users/${subscription.creatorId}`}
              key={subscription.creatorId}
            >
              <SubscriptionItem
                onUnsubscribe={() => {
                  unsubscribe.mutate({ userId: subscription.creatorId });
                }}
                disabled={unsubscribe.isPending}
                imageUrl={subscription.user.image}
                name={subscription.user.name}
                subscriberCount={subscription.user.subscriberCount}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
      />
    </>
  );
}
