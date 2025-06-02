import { type NextRequest, NextResponse } from "next/server"
import { ciudadSearchSchema } from "@/lib/models"

/**
 * POST /api/scraping/google-maps
 * Inicia el proceso de scraping para una ciudad específica
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, location, radius } = ciudadSearchSchema.parse(body)

    console.log(`🔍 Iniciando scraping para: ${location}`)

    // URL del webhook de n8n (configurable via env)
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    const token = process.env.N8N_WEBHOOK_TOKEN

    const payload = {
      ciudad: location,
      intenciones: ["telo", "albergue transitorio", "motel", "hotel por hora", "hotel alojamiento"],
      radio: radius,
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error en n8n: ${response.status} ${response.statusText}`)
    }

    console.log(`✅ Scraping iniciado exitosamente para: ${location}`)

    return NextResponse.json({
      success: true,
      ciudad: location,
      mensaje: `Scraping iniciado para ${location}`,
      payload,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error iniciando scraping:", error)
    return NextResponse.json(
      {
        error: "Error iniciando el scraping",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
