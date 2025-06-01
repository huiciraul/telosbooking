"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Send, CheckCircle, XCircle } from "lucide-react"

export default function TestWebhookPage() {
  const [ciudad, setCiudad] = useState("Buenos Aires")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [webhookConfig, setWebhookConfig] = useState<any>(null)

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000"

  const checkWebhookConfig = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/test-scraping`)
      const data = await response.json()
      setWebhookConfig(data)
    } catch (error) {
      console.error("Error checking webhook config:", error)
    }
  }

  const testScraping = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${baseUrl}/api/scraping/google-maps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "telos albergues transitorios",
          location: ciudad,
          radius: 5000,
        }),
      })

      const data = await response.json()
      setResult({
        success: response.ok,
        status: response.status,
        data,
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  const testDirectWebhook = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${baseUrl}/api/test-scraping`, {
        method: "POST",
      })

      const data = await response.json()
      setResult({
        success: response.ok,
        status: response.status,
        data,
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  useState(() => {
    checkWebhookConfig()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Webhook n8n</h1>
          <p className="text-gray-600">Prueba la integración con n8n para scraping automático</p>
        </div>

        <div className="space-y-6">
          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Configuración del Webhook</span>
                <Button variant="outline" size="sm" onClick={checkWebhookConfig}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {webhookConfig ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>URL del Webhook:</span>
                    <Badge variant={webhookConfig.webhookUrl !== "No configurado" ? "default" : "destructive"}>
                      {webhookConfig.webhookUrl !== "No configurado" ? "✅ Configurado" : "❌ No configurado"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Token de Seguridad:</span>
                    <Badge variant={webhookConfig.hasToken ? "default" : "destructive"}>
                      {webhookConfig.hasToken ? "✅ Configurado" : "❌ No configurado"}
                    </Badge>
                  </div>
                  {webhookConfig.webhookUrl !== "No configurado" && (
                    <div>
                      <p className="text-sm font-medium mb-1">URL:</p>
                      <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                        {webhookConfig.webhookUrl}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Cargando configuración...</p>
              )}
            </CardContent>
          </Card>

          {/* Test de Scraping */}
          <Card>
            <CardHeader>
              <CardTitle>Test de Scraping por Ciudad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ciudad a buscar:</label>
                  <Input
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ej: Buenos Aires, Córdoba, Rosario..."
                  />
                </div>
                <Button onClick={testScraping} disabled={loading || !ciudad.trim()} className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando scraping...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Iniciar Scraping para {ciudad}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Directo */}
          <Card>
            <CardHeader>
              <CardTitle>Test Directo del Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Prueba directa del webhook con datos predefinidos para Buenos Aires
                </p>
                <Button onClick={testDirectWebhook} disabled={loading} variant="outline" className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Probando webhook...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Probar Webhook Directo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span>Resultado del Test</span>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Éxito" : "Error"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.status && (
                    <div>
                      <span className="text-sm font-medium">Status HTTP:</span>
                      <Badge variant={result.status < 400 ? "default" : "destructive"} className="ml-2">
                        {result.status}
                      </Badge>
                    </div>
                  )}

                  {result.data && (
                    <div>
                      <p className="text-sm font-medium mb-2">Respuesta:</p>
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96 border">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-800 font-medium">Error:</p>
                      <p className="text-red-600 text-sm">{result.error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Instrucciones de Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. Configurar n8n:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Ve a: https://huiciraul.app.n8n.cloud</li>
                    <li>Importa el workflow desde: n8n-workflow-fixed.json</li>
                    <li>Activa el workflow (toggle ON)</li>
                    <li>Configura las variables de entorno en n8n</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Variables de entorno en Vercel:</h4>
                  <code className="block bg-gray-100 p-2 rounded text-xs">
                    N8N_WEBHOOK_URL=https://huiciraul.app.n8n.cloud/webhook/buscar-tipos
                    <br />
                    N8N_WEBHOOK_TOKEN=tu-token-secreto-aqui
                  </code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Verificar:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Que el workflow esté activo en n8n</li>
                    <li>Que las variables estén configuradas en Vercel</li>
                    <li>Que el token coincida en ambos lados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
