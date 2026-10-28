import type { Metadata } from "next";
import { Fira_Sans, Roboto } from "next/font/google";
import "./globals.css";
const headingFont = Fira_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" });
const bodyFont = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://shelf-sense-app-tan.vercel.app"),
  title: "ShelfSense — Rescue Stock Before It Becomes Waste",
  description: "Calculate expiry risk, estimated leftovers and compare keep, discount and bundle scenarios for independent grocery shops.",
  openGraph: {
    title: "ShelfSense — Rescue Stock Before It Becomes Waste",
    description: "Calculate expiry risk, estimated leftovers and compare stock-rescue scenarios.",
    url: "https://shelf-sense-app-tan.vercel.app",
    siteName: "ShelfSense",
    type: "website",
    images: [{ url: "/shelfsense-icon.svg", alt: "ShelfSense logo" }],
  },
  twitter: {
    card: "summary",
    title: "ShelfSense — Rescue Stock Before It Becomes Waste",
    description: "Calculate expiry risk, estimated leftovers and compare stock-rescue scenarios.",
    images: ["/shelfsense-icon.svg"],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body></html>;
}
