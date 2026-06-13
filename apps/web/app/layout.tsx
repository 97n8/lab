import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PublicLogic | Systems That Stick",
  description: "Institutional stewardship systems for continuity, data, and public-sector execution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
