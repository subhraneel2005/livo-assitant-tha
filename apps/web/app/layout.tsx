import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"
import "./globals.css";



export const metadata: Metadata = {
  title: "QA-yt chatapp",
  description: "Chat with youtube videos using robust rag pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
