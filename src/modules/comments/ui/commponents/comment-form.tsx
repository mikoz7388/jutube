import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema } from "@/db/schema/comments";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CommentformProps {
  videoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  parentId?: string;
  variant?: "comment" | "reply";
}

export function CommentForm({
  videoId,
  onSuccess,
  variant = "comment",
  parentId,
  onCancel,
}: CommentformProps) {
  const session = authClient.useSession();
  const user = session.data?.user;

  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast({ title: "comment added" });
      onSuccess?.();
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") {
        toast({
          title: "You are not logged in",
          description: "Log in if you want to comment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      parentId,
      value: "",
    },
  });

  const handleSubmit = (value: z.infer<typeof commentInsertSchema>) => {
    create.mutate(value);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        className="group flex gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.image}
          name={user?.name ?? "User"}
        />

        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "comment"
                        ? "Add a comment..."
                        : "Reply to this comment..."
                    }
                    className="min-h-0 resize-none overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 flex justify-end gap-2">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" disabled={create.isPending}>
              {variant === "comment" ? "Comment" : "Reply"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
