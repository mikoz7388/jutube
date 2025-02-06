import { Button } from "@/components/ui/button";
import { Outdent, UserCircleIcon } from "lucide-react";

export function AuthButton() {
  return (
    <Button
      variant={"outline"}
      className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-5"
    >
      <UserCircleIcon />
      Sign in
    </Button>
  );
}
