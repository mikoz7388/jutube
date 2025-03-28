import {
  SidebarHeader,
  useSidebar,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function StudioSidebarHeader() {
  const { user } = useAuth();
  const { state } = useSidebar();

  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="mt-2 flex flex-col items-center gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Your profile">
          <Link prefetch href={`/users/${user.id}`}>
            <UserAvatar imageUrl={user.image} name={user.name} size="xs" />
            <span className="text-sm">Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href={`/users/${user.id}`}>
        <UserAvatar
          imageUrl={user.image}
          name={user.name}
          className="size-[112px] transition-opacity hover:opacity-80"
        />
      </Link>
      <div className="mt-2 flex flex-col items-center gap-y-1">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-xs text-muted-foreground">{user.name}</p>
      </div>
    </SidebarHeader>
  );
}
