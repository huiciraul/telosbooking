import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    console.log("📊 Generando estadísticas del webhook...")

    // Obtener estadísticas de telos
    const statsQuery = `
      SELECT 
        COUNT(*) as total_telos,
        COUNT(CASE WHEN fuente LIKE '%n8n%' THEN 1 END) as telos_n8n,
        COUNT(CASE WHEN rating IS NOT NULL AND rating > 0 THEN 1 END) as telos_verificados,
        COALESCE(AVG(CASE WHEN rating IS NOT NULL AND rating > 0 THEN rating END), 0) as rating_promedio
      FROM telos 
      WHERE activo = true
    `

    const stats = await executeQuery(statsQuery)
    const statsData = stats[0] || {
      total_telos: 0,
      telos_n8n: 0,
      telos_verificados: 0,
      rating_promedio: 0,
    }

    return NextResponse.json({
      status: "active",
      endpoint: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/n8n/webhook`,
      timestamp: new Date().toISOString(),
      stats: {
        total_telos: Number(statsData.total_telos) || 0,
        telos_n8n: Number(statsData.telos_n8n) || 0,
        telos_verificados: Number(statsData.telos_verificados) || 0,
        rating_promedio: Number(statsData.rating_promedio) || 0,
      },
      security: {
        token_required: !!process.env.N8N_WEBHOOK_TOKEN,
        ip_filtering: !!process.env.ALLOWED_WEBHOOK_IPS,
        rate_limiting: true,
      },
    })
  } catch (error) {
    console.error("❌ Error generando estadísticas:", error)
    return NextResponse.json(
      {
        status: "error",
        endpoint: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/n8n/webhook`,
        timestamp: new Date().toISOString(),
        stats: {
          total_telos: 0,
          telos_n8n: 0,
          telos_verificados: 0,
          rating_promedio: 0,
        },
        security: {
          token_required: false,
          ip_filtering: false,
          rate_limiting: false,
        },
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Endpoint para recibir datos de n8n
    const data = await request.json()
    console.log("📥 Datos recibidos de n8n:", data)

    return NextResponse.json({
      success: true,
      message: "Datos recibidos correctamente",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error procesando webhook:", error)
    return NextResponse.json(
      {
        error: "Error procesando webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
