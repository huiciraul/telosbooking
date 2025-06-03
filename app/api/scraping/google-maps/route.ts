import { type NextRequest, NextResponse } from "next/server"
import { ciudadSearchSchema } from "@/lib/models"

/**
 * POST /api/scraping/google-maps
 * Inicia el proceso de scraping para una ciudad específica
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📥 Datos recibidos:", JSON.stringify(body, null, 2))

    const { query, location, radius } = ciudadSearchSchema.parse(body)

    console.log(`🔍 Iniciando scraping para: ${location}`)

    // Verificar configuración
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    const token = process.env.N8N_WEBHOOK_TOKEN

    if (!webhookUrl) {
      console.error("❌ N8N_WEBHOOK_URL no configurado")
      return NextResponse.json(
        {
          error: "Webhook no configurado",
          details: "N8N_WEBHOOK_URL no está configurado en las variables de entorno",
          success: false,
        },
        { status: 500 },
      )
    }

    console.log("🔗 Webhook URL:", webhookUrl)
    console.log("🔐 Token configurado:", !!token)

    const payload = {
      ciudad: location,
      intenciones: ["telo", "albergue transitorio", "motel", "hotel por hora", "hotel alojamiento"],
      radio: radius || 5000,
      timestamp: new Date().toISOString(),
      source: "manual-scraping",
    }

    console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2))

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    console.log("📊 Status de respuesta:", response.status)
    console.log("📊 Headers de respuesta:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("📊 Cuerpo de respuesta:", responseText)

    if (!response.ok) {
      console.error(`❌ Error en n8n: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `Error en n8n: ${response.status} ${response.statusText}`,
          details: responseText,
          webhookUrl,
          payload,
          success: false,
        },
        { status: response.status },
      )
    }

    console.log(`✅ Scraping iniciado exitosamente para: ${location}`)

    return NextResponse.json({
      success: true,
      ciudad: location,
      mensaje: `Scraping iniciado para ${location}`,
      payload,
      n8nResponse: responseText,
      webhookUrl,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error iniciando scraping:", error)
    return NextResponse.json(
      {
        error: "Error iniciando el scraping",
        details: error instanceof Error ? error.message : "Error desconocido",
        success: false,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/scraping/google-maps
 * Verificar estado del scraping
 */
export async function GET() {
  return NextResponse.json({
    status: "ready",
    webhookConfigured: !!process.env.N8N_WEBHOOK_URL,
    tokenConfigured: !!process.env.N8N_WEBHOOK_TOKEN,
    timestamp: new Date().toISOString(),
  })
}
