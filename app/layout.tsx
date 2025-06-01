import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TelosBooking - Encuentra el telo perfecto en Argentina",
  description:
    "La plataforma más completa para encontrar y comparar telos y albergues transitorios en Argentina. Precios, servicios, ubicaciones y más.",
  keywords: "telos, albergues transitorios, moteles, argentina, buenos aires, córdoba, rosario",
  authors: [{ name: "TelosBooking" }],
  creator: "TelosBooking",
  publisher: "TelosBooking",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://telosbooking.vercel.app",
    title: "TelosBooking - Encuentra el telo perfecto en Argentina",
    description: "La plataforma más completa para encontrar y comparar telos y albergues transitorios en Argentina.",
    siteName: "TelosBooking",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelosBooking - Encuentra el telo perfecto en Argentina",
    description: "La plataforma más completa para encontrar y comparar telos y albergues transitorios en Argentina.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
