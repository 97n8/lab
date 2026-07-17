import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://publiclogic.org"),
  title: {
    default: "PublicLogic | Make the Work Hold Together",
    template: "%s | PublicLogic",
  },
  description:
    "PublicLogic helps public organizations and complex projects turn scattered responsibilities, records, deadlines, and decisions into systems people can actually run.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PublicLogic | Make the Work Hold Together",
    description:
      "Governance, grants, permitting, documentation, and continuity support for work that has to hold together.",
    url: "https://publiclogic.org",
    siteName: "PublicLogic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PublicLogic | Make the Work Hold Together",
    description:
      "Governance, grants, permitting, documentation, and continuity support for work that has to hold together.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
