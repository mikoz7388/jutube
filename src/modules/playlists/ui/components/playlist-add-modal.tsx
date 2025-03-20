import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export function PlaylistAddModal({
  onOpenChange,
  open,
  videoId,
}: PlaylistAddModalProps) {
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      limit: 3,
      videoId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    },
  );
  const utils = trpc.useUtils();

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast({ title: "Video added to playlist" });
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getCustom.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast({ title: "Something went wrong", variant: "destructive" });
    },
  });
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast({ title: "Video removed from playlist" });
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getCustom.invalidate({ playlistId: data.playlistId });
    },
    onError: (e) => {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: e.message,
      });
    },
  });
  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.data)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                size="lg"
                className="w-full justify-start px-2 [&_svg]:size-5"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ playlistId: playlist.id, videoId });
                    return;
                  }
                  addVideo.mutate({ playlistId: playlist.id, videoId });
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
              >
                {playlist.containsVideo ? <SquareCheckIcon /> : <SquareIcon />}

                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
            classname="pt-0"
          />
        )}
      </div>
    </ResponsiveModal>
  );
}
