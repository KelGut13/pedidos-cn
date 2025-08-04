# Pedidos CN

Aplicación full-stack para gestión de pedidos con React (frontend) y Express.js (backend).

## 🏗️ Estructura del Proyecto

```
pedidos-cn/
├── backend/                 # Servidor backend (Express.js)
│   ├── server.js           # Archivo principal del servidor
│   ├── package.json        # Dependencias del backend
│   └── .env               # Variables de entorno
├── src/                    # Frontend React
├── public/                 # Archivos públicos
└── package.json           # Dependencias del frontend
```

## 🚀 Configuración de Puertos

- **Frontend (React)**: Puerto 3002
- **Backend (Express)**: Puerto 5002

## 📦 Instalación

1. **Instalar dependencias del frontend:**
   ```bash
   npm install
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🏃‍♂️ Ejecución

### Opción 1: Ejecutar ambos servidores simultáneamente
```bash
npm run dev
```

### Opción 2: Ejecutar por separado

**Frontend:**
```bash
npm start
# Correría en http://localhost:3002
```

**Backend:**
```bash
npm run backend
# Correría en http://localhost:5002
```

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el frontend en puerto 3002
- `npm run backend` - Inicia el backend en modo desarrollo
- `npm run dev` - Inicia ambos servidores simultáneamente
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas

## 📡 API Endpoints

### GET /
- **Descripción**: Estado del servidor
- **URL**: `http://localhost:5002/`

### GET /api/pedidos
- **Descripción**: Obtiene lista de pedidos
- **URL**: `http://localhost:5002/api/pedidos`

### POST /api/pedidos
- **Descripción**: Crea un nuevo pedido
- **URL**: `http://localhost:5002/api/pedidos`
- **Body**:
  ```json
  {
    "cliente": "Nombre del cliente",
    "producto": "Nombre del producto"
  }
  ```

## 🔧 Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
PORT=5002
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
