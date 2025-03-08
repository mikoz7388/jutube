import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscribeButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export function SubscribeButton({
  disabled,
  isSubscribed,
  onClick,
  className,
  size,
}: SubscribeButtonProps) {
  return (
    <Button
      className={cn("rounded-full", className)}
      variant={isSubscribed ? "secondary" : "default"}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}
