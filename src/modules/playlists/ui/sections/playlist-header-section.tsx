"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export function PlaylistHeaderSection({
  playlistId,
}: PlaylistHeaderSectionProps) {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
}
function PlaylistHeaderSectionSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
function PlaylistHeaderSectionSuspense({
  playlistId,
}: PlaylistHeaderSectionProps) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast({ title: "Playlist removed" });
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast({ title: "Something went wrong", variant: "destructive" });
    },
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p>Videos from the playlist</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
