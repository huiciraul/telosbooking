#!/bin/bash

# Script para configurar n8n localmente
echo "🚀 Configurando n8n para TelosBooking..."

# Instalar n8n globalmente
npm install -g n8n

# Crear directorio de trabajo
mkdir -p ~/n8n-telosbooking
cd ~/n8n-telosbooking

# Variables de entorno para n8n
cat > .env << EOF
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=telosbooking123
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:3000
N8N_WEBHOOK_TOKEN=tu-token-secreto-aqui
EOF

echo "✅ Configuración completada!"
echo "📝 Para iniciar n8n ejecuta: n8n start"
echo "🌐 Accede a: http://localhost:5678"
echo "👤 Usuario: admin"
echo "🔑 Contraseña: telosbooking123"
echo ""
echo "🔗 Webhook URL para configurar: http://localhost:3000/api/n8n/webhook"
