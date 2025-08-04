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

### 🏠 Sistema
- **GET /** - Estado del servidor
- **GET /api/health/db** - Verificar conexión a la base de datos

### 📦 Pedidos
- **GET /api/pedidos** - Obtener todos los pedidos con información de cliente y dirección
- **GET /api/pedidos/:id** - Obtener pedido específico con detalles completos
- **GET /api/pedidos/estadisticas** - Estadísticas generales de pedidos
- **GET /api/pedidos/estado/:estado** - Pedidos por estado (`pendiente`, `completado`, `cancelado`, `enviado`, `entregado`)
- **GET /api/pedidos/usuario/:idUsuario** - Pedidos de un usuario específico
- **POST /api/pedidos** - Crear nuevo pedido
- **PUT /api/pedidos/:id** - Actualizar pedido
- **DELETE /api/pedidos/:id** - Eliminar pedido

### 👥 Usuarios
- **GET /api/usuarios** - Obtener todos los usuarios
- **GET /api/usuarios/:id** - Obtener usuario específico
- **POST /api/usuarios** - Crear nuevo usuario

### 🛍️ Productos
- **GET /api/productos** - Obtener todos los productos activos
- **GET /api/productos/:id** - Obtener producto específico
- **GET /api/productos/search?q=término** - Buscar productos por nombre/descripción
- **GET /api/productos/categoria/:idCategoria** - Productos por categoría
- **GET /api/productos/stock-bajo?limite=10** - Productos con stock bajo

### 📊 Ejemplos de Uso

#### Crear un pedido:
```bash
curl -X POST http://localhost:5002/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "ID_usuario": 1,
    "ID_direccion": 1,
    "total": 1500.00,
    "estado": "pendiente"
  }'
```

#### Buscar productos:
```bash
curl "http://localhost:5002/api/productos/search?q=anillo"
```

#### Obtener estadísticas:
```bash
curl http://localhost:5002/api/pedidos/estadisticas
```

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

La aplicación se conecta a la base de datos MySQL existente `u465901502_joyeria` que contiene las siguientes tablas principales:

### Tablas Principales:
- **usuarios** - Información de usuarios del sistema
- **pedidos** - Pedidos realizados por los usuarios
- **detalle_pedido** - Productos específicos en cada pedido
- **productos** - Catálogo de productos de joyería
- **categorias** - Categorías de productos
- **marcas** - Marcas de productos
- **material** - Materiales de los productos
- **genero** - Género de los productos
- **direcciones** - Direcciones de entrega de usuarios
- **pagos** - Información de pagos
- **roles** - Roles de usuario (admin, cliente, etc.)

### Estructura del Pedido:
```sql
pedidos:
- ID_pedido (PK)
- ID_usuario (FK -> usuarios)
- ID_direccion (FK -> direcciones) 
- fecha
- total
- estado

detalle_pedido:
- ID_detalle (PK)
- ID_pedido (FK -> pedidos)
- ID_producto (FK -> productos)
- cantidad
- precio_unitario
```

### Estados de Pedido:
- `pendiente` - Pedido creado, esperando procesamiento
- `completado` - Pedido completado y entregado
- `cancelado` - Pedido cancelado
- `enviado` - Pedido enviado
- `entregado` - Pedido entregado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
