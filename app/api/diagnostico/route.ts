import { NextResponse } from "next/server"
import { executeQuery, checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  const diagnostico = {
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      connection_string: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.split("@")[0].slice(0, 15)}...`
        : "No configurada",
      tables: {
        ciudades: 0,
        telos: 0,
      },
      error: null as string | null,
    },
    environment: {
      hasWebhookUrl: !!process.env.N8N_WEBHOOK_URL,
      hasWebhookToken: !!process.env.N8N_WEBHOOK_TOKEN,
      webhookUrl: process.env.N8N_WEBHOOK_URL || "No configurado",
      nodeEnv: process.env.NODE_ENV || "development",
      vercelEnv: process.env.VERCEL_ENV || "development",
    },
    api: {
      endpoints: ["/api/telos", "/api/ciudades", "/api/n8n/webhook", "/api/seed", "/api/test-scraping"],
    },
  }

  try {
    // Verificar conexión a la base de datos
    diagnostico.database.connected = await checkDatabaseConnection()

    if (diagnostico.database.connected) {
      try {
        // Contar registros en las tablas
        const [ciudadesCount] = await executeQuery("SELECT COUNT(*) as count FROM ciudades")
        const [telosCount] = await executeQuery("SELECT COUNT(*) as count FROM telos WHERE activo = true")

        diagnostico.database.tables.ciudades = ciudadesCount.count
        diagnostico.database.tables.telos = telosCount.count
      } catch (error) {
        diagnostico.database.error = error instanceof Error ? error.message : "Error desconocido contando registros"
      }
    } else {
      diagnostico.database.error = "No se pudo conectar a la base de datos"
    }
  } catch (error) {
    console.error("❌ Error en diagnóstico de BD:", error)
    diagnostico.database.connected = false
    diagnostico.database.error = error instanceof Error ? error.message : "Error desconocido"
  }

  return NextResponse.json(diagnostico)
}
