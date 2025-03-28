import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl?: string | null;
  name: string;
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({
  imageUrl,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl ?? undefined} alt={name} />
      <AvatarFallback>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="avatar placeholder" src="/user-placeholder.svg" />
      </AvatarFallback>
    </Avatar>
  );
}
