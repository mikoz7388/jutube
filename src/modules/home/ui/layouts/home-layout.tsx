import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavBar } from "./components/home-navbar";
import { HomeSidebar } from "./components/home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavBar />
        <div className="flex">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto pt-[4rem]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
