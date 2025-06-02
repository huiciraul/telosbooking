# Motelos API

API completa para la plataforma Motelos - Encuentra telos y albergues transitorios en Argentina.  Este proyecto está diseñado para ser informativo y optimizado para AdSense.

## 🚀 Tecnologías

- **Framework**: Next.js 14 con App Router
- **Base de datos**: Neon PostgreSQL
- **Validación**: Zod
- **Styling**: Tailwind CSS
- **Automatización**: n8n para scraping

## 📊 Base de Datos

### Tablas principales:

- `ciudades` - Ciudades argentinas con contador de búsquedas
- `telos` - Albergues transitorios y moteles
- `reviews` - Reseñas de usuarios
- `favoritos` - Favoritos de usuarios

## 🔌 Endpoints API

### Telos

#### `GET /api/telos`
Obtiene lista de telos con filtros opcionales.

**Query Parameters:**
- `ciudad` - Filtrar por ciudad
- `barrio` - Filtrar por barrio/zona
- `amenities` - Servicios separados por coma
- `precio_min` - Precio mínimo
- `precio_max` - Precio máximo
- `limit` - Límite de resultados (default: 50)

**Ejemplo:**
\`\`\`bash
GET /api/telos?ciudad=Buenos%20Aires&amenities=WiFi,Jacuzzi&precio_max=5000
\`\`\`

#### `POST /api/telos`
Crea un nuevo telo.

**Body:**
\`\`\`json
{
  "nombre": "Hotel Ejemplo",
  "direccion": "Av. Corrientes 1234",
  "ciudad": "Buenos Aires",
  "precio": 3500,
  "telefono": "011-1234-5678",
  "servicios": ["WiFi", "Estacionamiento"],
  "descripcion": "Descripción del telo",
  "rating": 4.5
}
\`\`\`

#### `GET /api/telo/[slug]`
Obtiene un telo específico por su slug.

### Ciudades

#### `GET /api/ciudades`
Obtiene todas las ciudades disponibles.

#### `GET /api/ciudades/populares`
Obtiene las ciudades más buscadas ordenadas por popularidad.

#### `POST /api/ciudad/buscar`
Registra una búsqueda de ciudad y la crea si no existe.

**Body:**
\`\`\`json
{
  "nombre": "Córdoba",
  "provincia": "Córdoba"
}
\`\`\`

### Scraping y Automatización

#### `POST /api/scraping/google-maps`
Inicia el proceso de scraping para una ciudad.

**Body:**
\`\`\`json
{
  "query": "telos albergues transitorios",
  "location": "Buenos Aires",
  "radius": 5000
}
\`\`\`

#### `POST /api/n8n/webhook`
Webhook seguro para recibir datos desde n8n.

**Headers requeridos:**
\`\`\`
Authorization: Bearer YOUR_N8N_WEBHOOK_TOKEN
Content-Type: application/json
\`\`\`

**Body:**
\`\`\`json
[
  {
    "nombre": "Hotel Ejemplo",
    "direccion": "Dirección completa",
    "ciudad": "Buenos Aires",
    "precio": 3500,
    "servicios": ["WiFi", "Estacionamiento"],
    "fuente": "n8n",
    "fecha_scraping": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

#### `GET /api/n8n/webhook`
Verifica el estado del webhook y obtiene estadísticas.

## 🔐 Seguridad

### Variables de entorno requeridas:

\`\`\`env
# Base de datos
DATABASE_URL=postgresql://...

# Webhook n8n
N8N_WEBHOOK_URL=tu-token-secreto-aqui
N8N_WEBHOOK_TOKEN=tu-token-secreto-aqui

# Seguridad adicional (opcional)
ALLOWED_WEBHOOK_IPS=192.168.1.1,10.0.0.1
\`\`\`

### Características de seguridad:

- ✅ Validación de tokens Bearer para webhooks
- ✅ Rate limiting en memoria
- ✅ Validación de IPs permitidas (opcional)
- ✅ Validación estricta de datos con Zod
- ✅ Logging detallado de operaciones

## 🏗️ Arquitectura

\`\`\`
TelosBooking/
├── app/
│   ├── api/
│   │   ├── telos/          # CRUD de telos
│   │   ├── ciudades/       # Gestión de ciudades
│   │   ├── n8n/           # Webhooks de automatización
│   │   └── scraping/      # Endpoints de scraping
│   ├── telos-en/[ciudad]/ # Páginas de resultados
│   └── telo/[slug]/       # Páginas de detalle
├── components/
│   ├── layout/            # Headers, footers
│   ├── search/            # Componentes de búsqueda
│   ├── telos/            # Cards y listas de telos
│   └── ui/               # Componentes base
├── lib/
│   ├── db.ts             # Conexión a base de datos
│   ├── models.ts         # Tipos TypeScript
│   ├── security.ts       # Utilidades de seguridad
│   └── validators/       # Esquemas de validación
└── utils/
    └── generate-slug.ts  # Utilidades de texto
\`\`\`

## 🚀 Deployment

### Con Vercel (Recomendado):

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Escalabilidad:

- ✅ **API siempre disponible** - Vercel Edge Functions
- ✅ **Base de datos escalable** - Neon PostgreSQL con pooling
- ✅ **CDN global** - Vercel Edge Network
- ✅ **Rate limiting** - Implementado a nivel de aplicación

## 📱 Uso desde aplicaciones externas

La API está diseñada para ser consumida desde:

- ✅ Aplicaciones móviles (React Native, Flutter)
- ✅ Otros frontends (React, Vue, Angular)
- ✅ Integraciones de terceros
- ✅ Automatizaciones (n8n, Zapier)

### Ejemplo de uso desde React Native:

\`\`\`javascript
// Buscar telos
const response = await fetch('https://tu-dominio.vercel.app/api/telos?ciudad=Buenos Aires');
const telos = await response.json();

// Registrar búsqueda de ciudad
await fetch('https://tu-dominio.vercel.app/api/ciudad/buscar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Córdoba' })
});
\`\`\`

## 🔄 Integración con n8n

### Workflow recomendado:

1. **Trigger**: Cron job cada 24 horas
2. **Google Maps Scraping**: Buscar telos en ciudades populares
3. **Data Processing**: Limpiar y normalizar datos
4. **Webhook**: Enviar a `/api/n8n/webhook`

### Configuración n8n:

\`\`\`json
{
  "url": "https://tu-dominio.vercel.app/api/n8n/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer TU_TOKEN_SECRETO",
    "Content-Type": "application/json"
  }
}
\`\`\`

## 📊 Monitoreo

### Logs disponibles:

- ✅ Operaciones de base de datos
- ✅ Webhooks recibidos y procesados
- ✅ Errores de validación
- ✅ Rate limiting activado
- ✅ Búsquedas de ciudades

### Métricas recomendadas:

- Número de telos por ciudad
- Búsquedas más populares
- Tasa de éxito de webhooks
- Tiempo de respuesta de API

---

## 🆘 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.
