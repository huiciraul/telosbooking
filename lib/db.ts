import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

neonConfig.fetchConnectionCache = true

let sqlClient: Pool | null = null
let dbInitError: Error | null = null

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida")
  }

  sqlClient = new Pool({ connectionString: process.env.DATABASE_URL })
  console.log("✅ Conexión a Neon PostgreSQL establecida")
} catch (error: any) {
  console.error("❌ Error inicializando conexión a Neon:", error)
  dbInitError = error
}

export const sql = sqlClient

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  if (dbInitError) {
    throw dbInitError
  }

  if (!sqlClient) {
    throw new Error("Database client not available")
  }

  try {
    console.log(`🔍 Ejecutando consulta: ${query.slice(0, 100)}...`)
    const start = Date.now()

    const res = await sqlClient.query(query, params)
    const duration = Date.now() - start

    console.log(`✅ Consulta completada en ${duration}ms`)
    return res.rows as T[]
  } catch (error: any) {
    console.error("❌ Error ejecutando consulta SQL:", error)
    console.error("📝 Query:", query)
    console.error("📝 Params:", params)
    throw new Error("Database query failed")
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  if (dbInitError || !sqlClient) return false

  try {
    await sqlClient.query("SELECT 1")
    return true
  } catch (error) {
    console.error("❌ Error verificando conexión:", error)
    return false
  }
}
