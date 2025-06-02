import { NextResponse } from "next/server"

/**
 * POST /api/test-scraping
 * Endpoint para probar el scraping manualmente
 */
export async function POST() {
  try {
    console.log("🧪 Iniciando test de scraping...")

    // URL del webhook de n8n
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    const token = process.env.N8N_WEBHOOK_TOKEN

    const payload = {
      ciudad: "Buenos Aires",
      intenciones: ["telo", "albergue transitorio", "motel", "hotel por hora"],
      radio: 5000,
      timestamp: new Date().toISOString(),
    }

    console.log("📤 Enviando payload a n8n:", payload)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    console.log("📥 Respuesta de n8n:", responseText)

    if (!response.ok) {
      throw new Error(`Error en n8n: ${response.status} ${response.statusText} - ${responseText}`)
    }

    return NextResponse.json({
      success: true,
      message: "Test de scraping iniciado exitosamente",
      payload,
      n8nResponse: responseText,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error en test de scraping:", error)
    return NextResponse.json(
      {
        error: "Error en test de scraping",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/test-scraping
 * Verificar configuración
 */
export async function GET() {
  return NextResponse.json({
    webhookUrl: process.env.N8N_WEBHOOK_URL || "No configurado",
    hasToken: !!process.env.N8N_WEBHOOK_TOKEN,
    timestamp: new Date().toISOString(),
  })
}
