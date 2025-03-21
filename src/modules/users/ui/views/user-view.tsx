import { UserSection } from "../sections/user-section";
import { VideosSection } from "../sections/videos-section";

interface UserViewProps {
  userId: string;
}

export function UserView({ userId }: UserViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1300px] flex-col gap-y-6 px-4 pt-2.5">
      <UserSection userId={userId} />
      <VideosSection userId={userId} />
    </div>
  );
}
