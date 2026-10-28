import type { Metadata } from "next";
import { Fira_Sans, Roboto } from "next/font/google";
import "./globals.css";
const headingFont = Fira_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" });
const bodyFont = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });
export const metadata: Metadata = { title: "ShelfSense — Rescue Stock Before It Becomes Waste", description: "Inventory risk and stock rescue decision support for independent grocery shops." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body></html>;
}
