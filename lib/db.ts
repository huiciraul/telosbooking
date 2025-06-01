import { neon } from "@neondatabase/serverless"

// Crear una conexión SQL reutilizable
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL no está definida en las variables de entorno")
}

export const sql = neon(process.env.DATABASE_URL)

// Función helper para ejecutar consultas SQL directas con soporte de parámetros
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    // Convertimos $1, $2, etc. en valores directamente interpolados
    const parsedQuery = query.replace(/\$(\d+)/g, (_, index) => {
      const param = params[+index - 1]
      if (typeof param === "string") {
        return `'${param.replace(/'/g, "''")}'`
      }
      return param
    })

    console.log(`🔍 Ejecutando consulta: ${parsedQuery.slice(0, 100)}...`)

    const startTime = Date.now()
    const result = (await sql(parsedQuery)) as T
    const duration = Date.now() - startTime

    console.log(`✅ Consulta completada en ${duration}ms`)
    return result
  } catch (error) {
    console.error("❌ Error ejecutando consulta SQL:", error)
    console.error("📝 Query:", query)
    console.error("📝 Params:", params)
    throw error
  }
}

// Verifica la conexión a la base de datos ejecutando SELECT 1
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await executeQuery("SELECT 1")
    return true
  } catch (error) {
    console.error("❌ Error verificando conexión a la base de datos:", error)
    return false
  }
}
