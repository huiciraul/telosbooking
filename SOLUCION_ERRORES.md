# 🔧 Solución de errores TelosBooking

## 1. Error de n8n (404 Not Found)

### Problema:
El webhook `buscar-tipos` no está registrado o el workflow no está activo.

### Solución:
1. **Ve a tu instancia de n8n**: https://huiciraul.app.n8n.cloud
2. **Busca el workflow**: "TelosBooking Scraper" o similar
3. **Actívalo**: Asegúrate de que el toggle esté en ON
4. **Verifica la URL**: En el nodo Webhook, copia la URL completa
5. **Actualiza la variable de entorno**: `N8N_WEBHOOK_URL` debe ser la URL completa

## 2. Errores de base de datos

### Problema:
Conexión a la base de datos Neon PostgreSQL fallando.

### Solución:
1. **Verifica DATABASE_URL**: Debe estar correctamente configurada
2. **Ejecuta el seed**: Visita `/api/seed` para crear las tablas
3. **Verifica conectividad**: Usa `/diagnostico` para verificar el estado

## 3. Variables de entorno necesarias

\`\`\`env
# Base de datos (REQUERIDO)
DATABASE_URL=postgresql://...

# n8n (REQUERIDO para scraping)
N8N_WEBHOOK_URL=https://huiciraul.app.n8n.cloud/webhook/buscar-tipos
N8N_WEBHOOK_TOKEN=tu-token-secreto

# Seguridad (OPCIONAL)
ALLOWED_WEBHOOK_IPS=tu.ip.aqui
\`\`\`

## 4. Cómo obtener tu IP

\`\`\`bash
# Opción 1: Terminal
curl ifconfig.me

# Opción 2: Navegador
# Visita: https://whatismyipaddress.com/
\`\`\`

## 5. Pasos para solucionar

1. **Activa el workflow en n8n**
2. **Configura las variables de entorno**
3. **Ejecuta `/api/seed` para poblar la BD**
4. **Prueba `/api/test-scraping`**
5. **Verifica en `/diagnostico`**

## 6. URLs importantes

- **Diagnóstico**: `/diagnostico`
- **Admin**: `/admin`
- **Seed BD**: `/api/seed`
- **Test scraping**: `/api/test-scraping`
