"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Webhook, CheckCircle, XCircle } from "lucide-react"

interface DiagnosticoData {
  timestamp: string
  database: {
    connected: boolean
    tables: {
      ciudades: number
      telos: number
    }
  }
  environment: {
    hasWebhookUrl: boolean
    hasWebhookToken: boolean
    webhookUrl: string
  }
  api: {
    endpoints: string[]
  }
}

export default function DiagnosticoPage() {
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  const fetchDiagnostico = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/diagnostico")
      if (response.ok) {
        const data = await response.json()
        setDiagnostico(data)
      }
    } catch (error) {
      console.error("Error fetching diagnostico:", error)
    } finally {
      setLoading(false)
    }
  }

  const testEndpoint = async (endpoint: string) => {
    try {
      setTestResults((prev) => ({ ...prev, [endpoint]: { loading: true } }))

      const response = await fetch(endpoint)
      const data = await response.json()

      setTestResults((prev) => ({
        ...prev,
        [endpoint]: {
          loading: false,
          success: response.ok,
          status: response.status,
          data: Array.isArray(data)
            ? `${data.length} items`
            : typeof data === "object"
              ? JSON.stringify(data).slice(0, 100) + "..."
              : data,
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [endpoint]: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        },
      }))
    }
  }

  const initializeDatabase = async () => {
    try {
      const response = await fetch("/api/seed")
      if (response.ok) {
        await fetchDiagnostico()
      }
    } catch (error) {
      console.error("Error initializing database:", error)
    }
  }

  const testScraping = async () => {
    try {
      const response = await fetch("/api/test-scraping", { method: "POST" })
      const data = await response.json()
      setTestResults((prev) => ({
        ...prev,
        scraping: {
          loading: false,
          success: response.ok,
          data: JSON.stringify(data, null, 2),
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        scraping: {
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        },
      }))
    }
  }

  useEffect(() => {
    fetchDiagnostico()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Ejecutando diagnóstico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico del Sistema</h1>
          <p className="text-gray-600">Verifica el estado de TelosBooking</p>
        </div>

        <div className="space-y-6">
          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Base de Datos</span>
                {diagnostico?.database.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <Badge variant={diagnostico?.database.connected ? "default" : "destructive"}>
                    {diagnostico?.database.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Ciudades</p>
                  <p className="text-2xl font-bold">{diagnostico?.database.tables.ciudades || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telos</p>
                  <p className="text-2xl font-bold">{diagnostico?.database.tables.telos || 0}</p>
                </div>
              </div>

              {diagnostico?.database.tables.telos === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-800 font-medium">⚠️ Base de datos vacía</p>
                      <p className="text-yellow-600 text-sm">No hay telos en la base de datos</p>
                    </div>
                    <Button onClick={initializeDatabase} size="sm">
                      Inicializar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="w-5 h-5" />
                <span>Configuración n8n</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Webhook URL</span>
                  <Badge variant={diagnostico?.environment.hasWebhookUrl ? "default" : "destructive"}>
                    {diagnostico?.environment.hasWebhookUrl ? "Configurado" : "No configurado"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Webhook Token</span>
                  <Badge variant={diagnostico?.environment.hasWebhookToken ? "default" : "destructive"}>
                    {diagnostico?.environment.hasWebhookToken ? "Configurado" : "No configurado"}
                  </Badge>
                </div>
                {diagnostico?.environment.webhookUrl && (
                  <div>
                    <p className="text-sm font-medium mb-1">URL:</p>
                    <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                      {diagnostico.environment.webhookUrl}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoints API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnostico?.api.endpoints.map((endpoint) => (
                  <div key={endpoint} className="flex items-center justify-between">
                    <code className="text-sm">{endpoint}</code>
                    <div className="flex items-center space-x-2">
                      {testResults[endpoint]?.loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {testResults[endpoint]?.success === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {testResults[endpoint]?.success === false && <XCircle className="w-4 h-4 text-red-500" />}
                      <Button variant="outline" size="sm" onClick={() => testEndpoint(endpoint)}>
                        Probar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Pruebas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([endpoint, result]) => (
                    <div key={endpoint} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-medium">{endpoint}</code>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "✅ OK" : "❌ Error"}
                        </Badge>
                      </div>
                      {result.data && (
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">{result.data}</pre>
                      )}
                      {result.error && <p className="text-red-600 text-sm">{result.error}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={fetchDiagnostico}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar diagnóstico
                </Button>
                <Button variant="outline" onClick={testScraping}>
                  🧪 Probar scraping
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin" target="_blank" rel="noreferrer">
                    Ver panel admin
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
