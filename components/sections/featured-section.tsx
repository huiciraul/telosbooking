import { TeloCardBooking } from "@/components/telos/telo-card-booking"
import { mockTelos } from "@/lib/prisma"

export function FeaturedSection() {
  const featuredTelos = mockTelos.slice(0, 4)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Telos destacados en Buenos Aires</h2>
          <p className="text-gray-600">Los alojamientos mejor valorados por nuestros huéspedes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTelos.map((telo) => (
            <TeloCardBooking key={telo.id} telo={{ ...telo, disponible: true }} />
          ))}
        </div>
      </div>
    </section>
  )
}
