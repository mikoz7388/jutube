"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { StudioUploader } from "./studio-uploader";

export function StudioUploadModal() {
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

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={() => {}} endpoint={create.data.url} />
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
