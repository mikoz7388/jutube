import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const [isReady, setIsReady] = useState(false);
  const { data } = authClient.useSession();

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isReady,
    session: data?.session,
    user: data?.user,
    isLoggedIn: !!data?.user.id,
    loggedUserId: data?.user.id,
  };
}
