import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { SubscrptionsSection } from "./subscriptions-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function HomeSidebar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <Sidebar className="z-40 border-none pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
        {session ? (
          <>
            <Separator />
            <SubscrptionsSection />
          </>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
}
