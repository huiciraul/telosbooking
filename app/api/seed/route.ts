import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    console.log("🌱 Iniciando seed de la base de datos...")

    // Insertar más ciudades
    await executeQuery(`
      INSERT INTO ciudades (nombre, slug, provincia) VALUES 
      ('Buenos Aires', 'buenos-aires', 'Buenos Aires'),
      ('Córdoba', 'cordoba', 'Córdoba'),
      ('Rosario', 'rosario', 'Santa Fe'),
      ('Mendoza', 'mendoza', 'Mendoza'),
      ('La Plata', 'la-plata', 'Buenos Aires'),
      ('Mar del Plata', 'mar-del-plata', 'Buenos Aires'),
      ('Tucumán', 'tucuman', 'Tucumán'),
      ('Salta', 'salta', 'Salta')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Insertar más telos de ejemplo
    await executeQuery(`
      INSERT INTO telos (nombre, slug, direccion, ciudad, precio, telefono, servicios, descripcion, rating, imagen_url, activo, verificado) VALUES 
      ('Hotel Palermo Premium', 'hotel-palermo-premium', 'Av. Santa Fe 3000', 'Buenos Aires', 3500, '011-4555-1234', ARRAY['WiFi', 'Estacionamiento', 'Hidromasaje'], 'Moderno hotel en el corazón de Palermo', 4.5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', true, true),
      ('Albergue Villa Crespo', 'albergue-villa-crespo', 'Corrientes 4500', 'Buenos Aires', 2800, '011-4777-5678', ARRAY['WiFi', 'Aire Acondicionado'], 'Cómodo albergue en Villa Crespo', 4.2, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop', true, true),
      ('Motel Belgrano Deluxe', 'motel-belgrano-deluxe', 'Cabildo 2200', 'Buenos Aires', 4200, '011-4888-9012', ARRAY['Estacionamiento', 'Jacuzzi', 'TV Cable'], 'Elegante motel en Belgrano', 4.7, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop', true, true),
      ('Hotel Córdoba Centro', 'hotel-cordoba-centro', 'San Martín 150', 'Córdoba', 2500, '0351-422-3456', ARRAY['WiFi', 'Frigobar'], 'Hotel céntrico en Córdoba', 4.0, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', true, true),
      ('Albergue Rosario', 'albergue-rosario', 'Pellegrini 1200', 'Rosario', 2200, '0341-455-7890', ARRAY['WiFi', 'Estacionamiento'], 'Albergue moderno en Rosario', 4.3, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop', true, true),
      ('Motel Mendoza', 'motel-mendoza', 'Av. San Martín 500', 'Mendoza', 3200, '0261-123-4567', ARRAY['WiFi', 'Estacionamiento', 'Aire Acondicionado'], 'Motel con vista a la montaña', 4.1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', true, true)
      ON CONFLICT (slug) DO NOTHING
    `)

    // Verificar cuántos registros tenemos
    const [ciudadesCount] = await executeQuery("SELECT COUNT(*) as count FROM ciudades")
    const [telosCount] = await executeQuery("SELECT COUNT(*) as count FROM telos")

    console.log(`✅ Seed completado: ${ciudadesCount.count} ciudades, ${telosCount.count} telos`)

    return NextResponse.json({
      success: true,
      message: "Base de datos poblada exitosamente",
      data: {
        ciudades: ciudadesCount.count,
        telos: telosCount.count,
      },
    })
  } catch (error: any) {
    console.error("❌ Error al poblar la base de datos:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
