"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export function StudioUploadModal() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast({ title: "Video created", variant: "default" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={onSuccess} endpoint={create.data.url} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? <Loader2Icon /> : <PlusIcon />}
        Create
      </Button>
    </>
  );
}
