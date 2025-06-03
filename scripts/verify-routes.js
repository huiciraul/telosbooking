// Script simplificado para verificar las rutas principales del proyecto
console.log("🔍 Verificando rutas principales del proyecto...")

// Lista manual de rutas principales que deben funcionar
const mainRoutes = [
  { path: "/", name: "Página Principal" },
  { path: "/destinos", name: "Destinos" },
  { path: "/como-funciona", name: "Cómo Funciona" },
  { path: "/servicios", name: "Servicios" },
  { path: "/contacto", name: "Contacto" },
  { path: "/ayuda", name: "Ayuda" },
  { path: "/terminos", name: "Términos y Condiciones" },
  { path: "/privacidad", name: "Política de Privacidad" },
  { path: "/experiencias", name: "Experiencias" },
  { path: "/telos", name: "Lista de Telos" },
  { path: "/telos-cerca-de-mi", name: "Telos Cerca de Mí" },
  { path: "/admin", name: "Panel de Administración" },
  { path: "/diagnostico", name: "Diagnóstico del Sistema" },
  { path: "/test-webhook", name: "Test de Webhook" },
]

// Rutas dinámicas de ejemplo
const dynamicRoutes = [
  { path: "/telos-en/[ciudad]", example: "/telos-en/buenos-aires", name: "Telos por Ciudad" },
  { path: "/telo/[slug]", example: "/telo/hotel-ejemplo", name: "Página de Telo Individual" },
]

console.log(`📋 Rutas principales (${mainRoutes.length}):`)
mainRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route.name} - ${route.path}`)
})

console.log(`\n📋 Rutas dinámicas (${dynamicRoutes.length}):`)
dynamicRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route.name} - ${route.path} (ejemplo: ${route.example})`)
})

// Verificar APIs críticas
const apiRoutes = ["/api/ciudades", "/api/ciudades/populares", "/api/telos", "/api/stats", "/api/diagnostico"]

console.log(`\n📋 APIs críticas (${apiRoutes.length}):`)
apiRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route}`)
})

// Recomendaciones para verificación manual
console.log("\n🔍 RECOMENDACIONES PARA VERIFICACIÓN MANUAL:")
console.log("1. Verificar que cada página principal carga sin errores")
console.log("2. Comprobar que las páginas tienen contenido visible")
console.log("3. Verificar que los enlaces de navegación funcionan")
console.log("4. Probar al menos una ciudad en /telos-en/[ciudad]")
console.log("5. Verificar que las APIs devuelven datos válidos")

// Páginas que podrían tener problemas según AdSense
console.log("\n⚠️ PÁGINAS QUE PODRÍAN CAUSAR PROBLEMAS EN ADSENSE:")
console.log("- Páginas con poco contenido textual")
console.log("- Páginas que solo muestran formularios")
console.log("- Páginas de error o sin datos")
console.log("- Páginas de administración (deberían estar protegidas)")

console.log("\n✅ Verificación de rutas completada.")
console.log("💡 Sugerencia: Probar manualmente las rutas listadas arriba")
