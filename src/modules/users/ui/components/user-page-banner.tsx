import { cn } from "@/lib/utils";
import { userGetOneOutput } from "../../types";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerUploadModal } from "./banner-upload-modal";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface UserPageBannerProps {
  user: userGetOneOutput;
}

export function UserPageBannerSkeleton() {
  return <Skeleton className="h-[15vh] max-h-[200px] w-full md:h-[25vh]" />;
}

export function UserPageBanner({ user }: UserPageBannerProps) {
  const { loggedUserId, isReady } = useAuth();

  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);

  return (
    <div className="group relative">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div
        className={cn(
          "h-[15vh] max-h-[200px] w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 md:h-[25vh]",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100",
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {isReady &&
          (loggedUserId === user.id ? (
            <Button
              onClick={() => setIsBannerUploadModalOpen(true)}
              type="button"
              size="icon"
              className="absolute right-4 top-4 rounded-full bg-black/50 opacity-100 transition-opacity duration-300 hover:bg-black/50 group-hover:opacity-100 md:opacity-0"
            >
              <Edit2Icon className="size-4 text-white" />
            </Button>
          ) : null)}
      </div>
    </div>
  );
}
