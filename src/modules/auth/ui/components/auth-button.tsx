"use client";

import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function AuthButton() {
  const { user, isReady } = useAuth();
  return (
    <>
      {isReady &&
        (!user ? (
          <Button
            asChild
            variant={"outline"}
            className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
          >
            <Link prefetch href={"/sign-in"}>
              <UserCircleIcon />
              Sign In
            </Link>
          </Button>
        ) : (
          <Button
            variant={"link"}
            asChild
            className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
          >
            <UserDropdown imageURL={user.image ?? undefined} name={user.name} />
          </Button>
        ))}
    </>
  );
}
