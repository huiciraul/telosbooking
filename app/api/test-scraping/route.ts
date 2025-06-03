import { NextResponse } from "next/server"

/**
 * POST /api/test-scraping
 * Endpoint para probar el scraping manualmente con diagnóstico completo
 */
export async function POST() {
  try {
    console.log("🧪 Iniciando test de scraping...")

    // Verificar variables de entorno
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    const token = process.env.N8N_WEBHOOK_TOKEN
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL

    console.log("🔍 Variables de entorno:")
    console.log("- N8N_WEBHOOK_URL:", webhookUrl ? "✅ Configurado" : "❌ No configurado")
    console.log("- N8N_WEBHOOK_TOKEN:", token ? "✅ Configurado" : "❌ No configurado")
    console.log("- VERCEL_URL:", vercelUrl ? "✅ Configurado" : "❌ No configurado")

    if (!webhookUrl) {
      return NextResponse.json(
        {
          error: "N8N_WEBHOOK_URL no está configurado",
          details: "Configura la variable de entorno N8N_WEBHOOK_URL en Vercel",
          success: false,
        },
        { status: 500 },
      )
    }

    const payload = {
      ciudad: "Buenos Aires",
      intenciones: ["telo", "albergue transitorio", "motel", "hotel por hora"],
      radio: 5000,
      timestamp: new Date().toISOString(),
    }

    console.log("📤 Enviando payload a n8n:", JSON.stringify(payload, null, 2))
    console.log("📍 URL destino:", webhookUrl)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    console.log("📥 Respuesta de n8n - Status:", response.status)
    console.log("📥 Respuesta de n8n - Headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("📥 Respuesta de n8n - Body:", responseText)

    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      parsedResponse = responseText
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Error en n8n: ${response.status} ${response.statusText}`,
          details: responseText,
          webhookUrl,
          hasToken: !!token,
          success: false,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test de scraping iniciado exitosamente",
      payload,
      n8nResponse: parsedResponse,
      webhookUrl,
      hasToken: !!token,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error en test de scraping:", error)
    return NextResponse.json(
      {
        error: "Error en test de scraping",
        details: error instanceof Error ? error.message : "Error desconocido",
        success: false,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/test-scraping
 * Verificar configuración completa
 */
export async function GET() {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const token = process.env.N8N_WEBHOOK_TOKEN
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL

  return NextResponse.json({
    configuration: {
      webhookUrl: webhookUrl || "No configurado",
      hasToken: !!token,
      vercelUrl: vercelUrl || "No configurado",
    },
    status: {
      webhookConfigured: !!webhookUrl,
      tokenConfigured: !!token,
      vercelConfigured: !!vercelUrl,
    },
    recommendations: !webhookUrl
      ? [
          "Configura N8N_WEBHOOK_URL en las variables de entorno de Vercel",
          "Asegúrate de que el workflow esté activo en n8n",
          "Verifica que la URL del webhook sea correcta",
        ]
      : [],
    timestamp: new Date().toISOString(),
  })
}
