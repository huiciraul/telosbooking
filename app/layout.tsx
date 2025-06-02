import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Motelos - Albergues Transitorios y Telos en Argentina",
  description:
    "Encuentra los mejores albergues transitorios y telos en Argentina. Compara precios, servicios y ubicaciones de hoteles por horas. La guía más completa de albergues temporarios en Buenos Aires, Córdoba, Rosario y más ciudades.",
  keywords:
    "albergues transitorios, telos, moteles, hoteles por horas, albergues temporarios, argentina, buenos aires, córdoba, rosario, parejas, privacidad, habitaciones por horas",
  authors: [{ name: "Motelos Argentina" }],
  creator: "Motelos",
  publisher: "Motelos",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://motelos.vercel.app",
    title: "Motelos - Albergues Transitorios y Telos en Argentina",
    description:
      "La guía más completa de albergues transitorios y telos en Argentina. Encuentra el albergue temporario perfecto para parejas.",
    siteName: "Motelos Argentina",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motelos - Albergues Transitorios y Telos en Argentina",
    description:
      "Encuentra los mejores albergues transitorios y telos en Argentina. Guía completa de hoteles por horas.",
  },
  generator: "v0.dev",
  alternates: {
    canonical: "https://motelos.vercel.app",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="geo.region" content="AR" />
        <meta name="geo.placename" content="Argentina" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
