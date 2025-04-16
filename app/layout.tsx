import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todovex.ai",
  description:
    "TodoVex organiza tus tareas de manera sencilla y predice lo que viene a continuacion utilizando IA.",
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
      <body className={defaultFont.className}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
