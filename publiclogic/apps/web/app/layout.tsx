import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://publiclogic.org"),
  title: {
    default: "PublicLogic | Systems That Stick",
    template: "%s | PublicLogic",
  },
  description:
    "Institutional stewardship systems for continuity, data, and public-sector execution.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PublicLogic | Systems That Stick",
    description:
      "Institutional stewardship systems for continuity, data, and public-sector execution.",
    url: "https://publiclogic.org",
    siteName: "PublicLogic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PublicLogic | Systems That Stick",
    description:
      "Institutional stewardship systems for continuity, data, and public-sector execution.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
