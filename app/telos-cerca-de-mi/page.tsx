import type { Metadata } from "next"
import TelosCercaDeMiClientPage from "./client-page" // Asegúrate que el nombre del archivo coincida

export const metadata: Metadata = {
  title: "Telos Cerca de Mí | Encuentra Albergues Transitorios Cercanos | Motelos",
  description:
    "Encuentra telos y albergues transitorios cerca de tu ubicación actual. Resultados basados en geolocalización para máxima conveniencia y discreción.",
  keywords: [
    "telos cerca de mi",
    "albergues transitorios cercanos",
    "moteles cerca",
    "hoteles alojamiento geolocalizacion",
    "telo ubicación actual",
  ],
  alternates: {
    canonical: "/telos-cerca-de-mi", // Asume que tu dominio base está configurado en layout.tsx o next.config.js
  },
  openGraph: {
    title: "Telos Cerca de Mí | Motelos",
    description:
      "Descubre albergues transitorios y telos disponibles en tu área inmediata. ¡Encuentra tu escape perfecto ahora!",
    url: "/telos-cerca-de-mi",
    type: "website",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Reemplaza con una imagen relevante
        width: 1200,
        height: 630,
        alt: "Mapa con telos cercanos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telos Cerca de Mí | Motelos",
    description:
      "La forma más rápida de encontrar telos y albergues transitorios cerca de ti. Privacidad y comodidad a tu alcance.",
    images: ["/placeholder.svg?height=600&width=1200"], // Reemplaza con una imagen relevante
  },
}

export default function TelosCercaDeMiPage() {
  return <TelosCercaDeMiClientPage />
}
