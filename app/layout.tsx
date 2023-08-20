import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YT Downloader",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <header className="flex items-center gap-3 min-h-[4rem] w-full flex-row p-3">
          <Image
            className="w-[32px] h-[32px]"
            src="/logo.png"
            width={32}
            height={32}
            alt="cspalevic"
          />
          <h3>YT Downloader</h3>
        </header>
        <main className="flex flex-1 justify-center items-center">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
