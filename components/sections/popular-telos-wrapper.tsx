"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Importación dinámica del componente PopularTelos
const PopularTelosComponent = dynamic(() => import("./popular-telos").then((mod) => mod.PopularTelos), {
  loading: () => (
    <section className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Populares cerca tuyo</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: false,
})

export function PopularTelosWrapper() {
  return (
    <Suspense
      fallback={
        <section className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Populares cerca tuyo</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          </div>
        </section>
      }
    >
      <PopularTelosComponent />
    </Suspense>
  )
}
