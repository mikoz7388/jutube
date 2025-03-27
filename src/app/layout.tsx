import "newrelic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as Toasterold } from "@/components/ui/toaster";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { NewRelicBrowser } from "@/components/new-relic-browser";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jutube",
  description: "A YouTube clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <NewRelicBrowser />

      <TRPCProvider>
        <body className={inter.className}>
          {children}
          <Toaster richColors />
          <Toasterold />
        </body>
      </TRPCProvider>
    </html>
  );
}
