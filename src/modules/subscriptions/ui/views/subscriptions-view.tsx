import { SubscriptionsSection } from "../sections/subscriptions-section";

export function SubscriptionsView() {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">All Subscriptions</h1>
        <p>View and manage all your Subscriptions</p>
      </div>
      <SubscriptionsSection />
    </div>
  );
}
