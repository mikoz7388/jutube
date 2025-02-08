import { trpc } from "@/trpc/server";

export default async function Home() {
  const data = await trpc.hello({ text: "world" });

  return <div>no videos yet {data.greeting}</div>;
}
