import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";

import "./globals.css";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todovex.ai",
  description:
    "TodoVex seamlessly organizes your tasks and predicts what's nextusing AI.",
  icons: {
    icon: "/icon.ico",
  },
  // metadataBase: new URL(ORIGIN_URL),
  // alternates: {
  //   canonical: ORIGIN_URL,
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={defaultFont.className}>{children}</body>
    </html>
  );
}
