import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as Toasterold } from "@/components/ui/toaster";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jutube",
  description: "A YouTube clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
