import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAY · Kendall Pond Lodge | PublicLogic",
  description:
    "STAY operator dashboard for Kendall Pond Lodge — bookings, turnovers, calendar, and financials as governed CaseSpaces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
