import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const SITE_URL = "https://publiclogic.org"
const SITE_NAME = "PublicLogic"
const DESCRIPTION =
  "PublicLogic builds the governance-aware continuity layer for real work — one time-stamped record from intake to exit, for small shops and town halls alike. Systems that stick."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Systems That Stick`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "PublicLogic",
    "PuddleJumper",
    "CaseSpace",
    "governance software",
    "municipal software",
    "continuity of record",
    "audit trail",
    "public-sector operations",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Systems That Stick`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Systems That Stick`,
    description: DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#00453e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
