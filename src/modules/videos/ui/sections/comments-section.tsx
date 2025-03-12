"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/lib/constants";
import { CommentForm } from "@/modules/comments/ui/commponents/comment-form";
import { CommentItem } from "@/modules/comments/ui/commponents/comment-item";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}
export function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function CommentsSectionSkeleton() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Loader2Icon className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}

export function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">{comments.pages[0].totalCount ?? 0} comments</h2>
        <CommentForm videoId={videoId} />
        <div className="mt-2 flex flex-col gap-4">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))}
          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            fetchNextPage={query.fetchNextPage}
            isFetchingNextPage={query.isFetchNextPageError}
          />
        </div>
      </div>
    </div>
  );
}
