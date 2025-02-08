"use client";

import { trpc } from "@/trpc/client";

export function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "world" });

  return (
    <div>
      <h1>hello world {data.greeting}</h1>
    </div>
  );
}
