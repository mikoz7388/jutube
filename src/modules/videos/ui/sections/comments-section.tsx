"use client";

import { CommentForm } from "@/modules/comments/ui/commponents/comment-form";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}
export function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <Suspense fallback={<p>loading</p>}>
      <ErrorBoundary fallback={<p>error</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

export function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <p> 0 comments</p>
        <CommentForm videoId={videoId} />
      </div>
      {JSON.stringify(comments)}
    </div>
  );
}
