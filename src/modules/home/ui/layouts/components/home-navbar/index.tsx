import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-intut";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export function HomeNavBar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center bg-white px-2 pr-5">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link href="/">
          <div className="flex items-center gap-1 p-4">
            <Image src="/logo.svg" height={32} width={32} alt="logo" />
            <p className="text-xl font-semibold tracking-tighter">Jutube</p>
          </div>
        </Link>
      </div>
      <div className="mx-auto flex max-w-[720px] flex-1 justify-center">
        <SearchInput />
      </div>
      <div className="flex flex-shrink-0 items-center gap-4">
        <AuthButton />
      </div>
    </nav>
  );
}
