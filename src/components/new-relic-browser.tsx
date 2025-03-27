import newrelic from "newrelic";
import Script from "next/script";
export async function NewRelicBrowser() {
  if (newrelic.agent.collector.isConnected() === false) {
    await new Promise((resolve) => {
      newrelic.agent.on("connected", resolve);
    });
  }

  const browserTimingHeader = newrelic.getBrowserTimingHeader({
    hasToRemoveScriptWrapper: true,
    allowTransactionlessInjection: true,
  });

  return (
    <>
      <Script
        id="nr-browser-agent"
        dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
      />
    </>
  );
}
