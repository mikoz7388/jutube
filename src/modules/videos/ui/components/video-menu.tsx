import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

export function VideoMenu({
  videoId,
  onRemove,
  variant = "ghost",
}: VideoMenuProps) {
  const onShare = () => {
    const fullVideoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${videoId}`;
    navigator.clipboard.writeText(fullVideoUrl);
    toast({
      title: "Link copied to the clipboard",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ListPlusIcon className="mr-2 size-4" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem>
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
