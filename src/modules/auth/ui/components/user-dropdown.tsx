import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { ClapperboardIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserDropdown({
  imageURL,
  name,
}: {
  imageURL: string | undefined;
  name: string;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar imageUrl={imageURL} name={name} size={"lg"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    utils.videos.getMany.invalidate();
                    router.push("/");
                  },
                },
              });
            }}
            variant={"ghost"}
            className="p-0"
          >
            <LogOutIcon />
            Sign out
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant={"ghost"} asChild className="p-0">
            <Link prefetch href={"/studio"}>
              <ClapperboardIcon /> Studio
            </Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
