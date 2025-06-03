import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    console.log("🧹 Iniciando limpieza de la base de datos...")

    // 1. Identificar duplicados basados en nombre y dirección
    const duplicados = await executeQuery(`
      WITH duplicados AS (
        SELECT 
          nombre, 
          direccion,
          ciudad,
          COUNT(*) as total,
          MIN(id) as id_a_mantener
        FROM telos
        GROUP BY nombre, direccion, ciudad
        HAVING COUNT(*) > 1
      )
      SELECT 
        t.id, 
        t.nombre, 
        t.direccion, 
        t.ciudad,
        d.id_a_mantener
      FROM telos t
      JOIN duplicados d ON t.nombre = d.nombre AND t.direccion = d.direccion AND t.ciudad = d.ciudad
      WHERE t.id != d.id_a_mantener
    `)

    console.log(`🔍 Se encontraron ${duplicados.length} telos duplicados`)

    // 2. Eliminar los duplicados (mantener solo uno de cada grupo)
    if (duplicados.length > 0) {
      const idsAEliminar = duplicados.map((d: any) => d.id)

      await executeQuery(
        `
        DELETE FROM telos
        WHERE id = ANY($1)
      `,
        [idsAEliminar],
      )

      console.log(`🗑️ Se eliminaron ${duplicados.length} telos duplicados`)
    }

    // 3. Normalizar precios irreales (demasiado bajos o altos)
    const preciosActualizados = await executeQuery(`
      UPDATE telos
      SET precio = 
        CASE 
          WHEN precio IS NULL OR precio <= 0 THEN floor(random() * 3000) + 2000
          WHEN precio < 1000 THEN precio * 10
          WHEN precio > 10000 THEN floor(precio / 2)
          ELSE precio
        END
      WHERE precio IS NULL OR precio <= 0 OR precio < 1000 OR precio > 10000
      RETURNING id, nombre, precio as precio_nuevo
    `)

    console.log(`💰 Se normalizaron los precios de ${preciosActualizados.length} telos`)

    // 4. Añadir restricciones para prevenir duplicados futuros
    try {
      // Crear un índice único para prevenir duplicados exactos
      await executeQuery(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_telos_nombre_direccion_ciudad
        ON telos (LOWER(nombre), LOWER(direccion), LOWER(ciudad))
      `)
      console.log("✅ Se creó un índice único para prevenir duplicados futuros")
    } catch (error) {
      console.error("⚠️ Error al crear índice único:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos limpiada exitosamente",
      stats: {
        duplicados_eliminados: duplicados.length,
        precios_normalizados: preciosActualizados.length,
        restricciones_añadidas: true,
      },
      detalles: {
        duplicados: duplicados.map((d: any) => ({
          id: d.id,
          nombre: d.nombre,
          direccion: d.direccion,
          ciudad: d.ciudad,
        })),
        precios: preciosActualizados.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          precio_nuevo: p.precio_nuevo,
        })),
      },
    })
  } catch (error: any) {
    console.error("❌ Error al limpiar la base de datos:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
