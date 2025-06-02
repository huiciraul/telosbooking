# 🔧 Solución de errores Motelos

## 1. Errores de base de datos

### Problema:
Conexión a la base de datos Neon PostgreSQL fallando.

### Solución:
1. **Verifica DATABASE_URL**: Debe estar correctamente configurada en tus variables de entorno de Vercel.
2. **Ejecuta el seed**: Visita `/api/seed` en tu aplicación desplegada para crear las tablas si aún no existen.
3. **Verifica conectividad**: Usa la página `/diagnostico` para verificar el estado de la conexión a la base de datos.

## 2. Variables de entorno necesarias

\`\`\`env
# Base de datos (REQUERIDO)
DATABASE_URL=postgresql://...

# n8n (REQUERIDO para scraping)
N8N_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/buscar-tipos
N8N_WEBHOOK_TOKEN=tu-token-secreto

# Seguridad (OPCIONAL)
ALLOWED_WEBHOOK_IPS=tu.ip.aqui
\`\`\`

## 3. Pasos para solucionar problemas de datos

1. **Configura las variables de entorno** en Vercel, especialmente `DATABASE_URL`, `N8N_WEBHOOK_URL` y `N8N_WEBHOOK_TOKEN`.
2. **Ejecuta `/api/seed`** para poblar la BD con las tablas necesarias.
3. **Prueba `/api/test-scraping`** para simular una llamada a n8n y verificar si los datos se reciben y persisten.
4. **Verifica en `/diagnostico`** el estado de la base de datos y la API.

## 4. URLs importantes

- **Diagnóstico**: `/diagnostico`
- **Admin**: `/admin`
- **Seed BD**: `/api/seed`
- **Test scraping**: `/api/test-scraping`
\`\`\`


### 2. Eliminar funcionalidades no esenciales (internas a la app)

Para enfocarnos en el modelo de AdSense y la eficiencia, eliminaremos los componentes y páginas de reserva o de gestión de usuarios:
