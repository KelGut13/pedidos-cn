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

### GET /api/health/db
- **Descripción**: Verificar conexión a la base de datos
- **URL**: `http://localhost:5002/api/health/db`

### GET /api/pedidos
- **Descripción**: Obtiene todos los pedidos
- **URL**: `http://localhost:5002/api/pedidos`

### GET /api/pedidos/:id
- **Descripción**: Obtiene un pedido específico por ID
- **URL**: `http://localhost:5002/api/pedidos/1`

### POST /api/pedidos
- **Descripción**: Crea un nuevo pedido
- **URL**: `http://localhost:5002/api/pedidos`
- **Body**:
  ```json
  {
    "cliente": "Nombre del cliente",
    "producto": "Nombre del producto",
    "estado": "pendiente"
  }
  ```

### PUT /api/pedidos/:id
- **Descripción**: Actualiza un pedido existente
- **URL**: `http://localhost:5002/api/pedidos/1`
- **Body**:
  ```json
  {
    "cliente": "Nombre del cliente actualizado",
    "producto": "Nombre del producto actualizado",
    "estado": "completado"
  }
  ```

### DELETE /api/pedidos/:id
- **Descripción**: Elimina un pedido
- **URL**: `http://localhost:5002/api/pedidos/1`

### GET /api/pedidos/estado/:estado
- **Descripción**: Obtiene pedidos por estado
- **URL**: `http://localhost:5002/api/pedidos/estado/pendiente`
- **Estados válidos**: `pendiente`, `en_proceso`, `completado`, `cancelado`

## 🔧 Variables de Entorno

El archivo `.env` en la carpeta `backend/` debe contener:

```env
# Servidor
PORT=5002
NODE_ENV=development

# Base de datos MySQL
DB_HOST=srv1009.hstgr.io
DB_USER=u465901502_admin
DB_PASSWORD=@UTequipo2
DB_NAME=u465901502_joyeria
DB_PORT=3306

# CORS Origin
FRONTEND_URL=http://localhost:3002
```

## 🗄️ Base de Datos

La aplicación se conecta a una base de datos MySQL y crea automáticamente la tabla `pedidos` con la siguiente estructura:

```sql
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    producto VARCHAR(255) NOT NULL,
    estado ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
