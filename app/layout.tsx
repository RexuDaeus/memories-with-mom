import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseProvider } from "@/components/firebase-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Dancing_Script } from "next/font/google"

// Load Dancing Script font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing-script",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Memories with Mom",
  description: "A special card stack of memories with Mom",
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={dancingScript.variable}>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        <script src={`/refresh.js?v=${Date.now()}`} />
      </head>
      <body>
        <FirebaseProvider>
          <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}

