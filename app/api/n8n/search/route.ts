import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const searchSchema = z.object({
  ciudad: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ciudad } = searchSchema.parse(body)

    console.log(`🔍 Buscando telos en n8n para: ${ciudad}`)

    const webhookUrl = "https://huiciraul.app.n8n.cloud/webhook/buscar-tipos"

    const payload = { ciudad }

    console.log("📤 Enviando payload a n8n:", payload)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error en n8n: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("📥 Respuesta de n8n:", data)

    // La respuesta ya es un array plano de telos
    const telosLimpios = (Array.isArray(data) ? data : []).map((telo: any) => ({
      id: telo.slug || `temp-${Date.now()}-${Math.random()}`,
      nombre: telo.nombre?.replace(/["']/g, "") || "Sin nombre",
      slug: telo.slug || telo.nombre?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      direccion: telo.direccion || "Dirección no disponible",
      ciudad: telo.ciudad?.replace(/^W\d+\s+/, "") || ciudad,
      precio: telo.precio ?? Math.floor(Math.random() * 3000) + 2000,
      telefono: telo.telefono || null,
      servicios: telo.servicios?.length > 0 ? telo.servicios : ["WiFi", "Estacionamiento"],
      descripcion: telo.descripcion || `${telo.nombre} ubicado en ${telo.direccion}`,
      rating: telo.rating ?? (Math.random() * 2 + 3).toFixed(1),
      imagen_url: telo.imagen_url || null,
      lat: telo.lat ?? null,
      lng: telo.lng ?? null,
      activo: true,
      verificado: false,
      fuente: "n8n-direct",
    }))

    console.log(`✅ Procesados ${telosLimpios.length} telos desde n8n`)

    return NextResponse.json({
      success: true,
      telos: telosLimpios,
      total: telosLimpios.length,
      fuente: "n8n-direct",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error buscando en n8n:", error)
    return NextResponse.json(
      {
        error: "Error buscando telos en n8n",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
