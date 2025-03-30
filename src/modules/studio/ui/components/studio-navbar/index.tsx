import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModal } from "../studio-upload-modal";

export function StudioNavBar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-2 pr-5 shadow-md">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link prefetch href="/studio">
          <div className="flex items-center gap-1 p-4">
            <Image src="/logo.svg" height={32} width={32} alt="logo" />
            <p className="text-xl font-semibold tracking-tighter">Studio</p>
          </div>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <StudioUploadModal />
        <AuthButton />
      </div>
    </nav>
  );
}
