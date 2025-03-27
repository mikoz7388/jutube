import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as Toasterold } from "@/components/ui/toaster";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import newrelic from "newrelic";
import Script from "next/script";

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
      <Script
        id="nr-browser-agent"
        dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
      />
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
