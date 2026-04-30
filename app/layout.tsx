import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TripSplit - Split Expenses Effortlessly",
  description:
    "Easily manage and split trip expenses with friends. Calculate who owes whom in seconds.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} scroll-smooth`}
      style={{ colorScheme: "light" }} // ✅ force light mode
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
