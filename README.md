# Sistema de Pedidos CN

Sistema de gestión de pedidos con autenticación de usuarios.

## Estructura del proyecto

El proyecto está organizado en dos partes principales:

- **Backend**: API REST con Node.js y Express
- **Frontend**: Aplicación web con React

## Requisitos

- Node.js 14.x o superior
- MySQL 5.7 o superior

## Configuración inicial

### Base de datos

1. Crea una base de datos MySQL llamada `joyeria`
2. Importa el archivo SQL inicial (si existe) o espera a que la aplicación cree las tablas automáticamente

### Backend

1. Navega a la carpeta `/backend`
2. Configura el archivo `.env` con tus credenciales de base de datos
3. Instala las dependencias:

```bash
cd backend
npm install
```

4. Inicia el servidor:

```bash
npm start
```

El servidor estará disponible en `http://localhost:5002`

### Frontend

1. Navega a la carpeta raíz
2. Instala las dependencias:

```bash
npm install
```

3. Inicia la aplicación:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Ejecutar ambos a la vez (desarrollo)

Para ejecutar tanto el backend como el frontend simultáneamente:

```bash
cd <ruta-del-proyecto>
cp dev-package.json package.json
npm install
npm run dev
```

## Credenciales disponibles

La base de datos ya contiene usuarios. Puedes iniciar sesión con cualquiera de estos emails:

- **Email**: tic-300015@utnay.edu.mx (Kelvim Isahí Sandoval Gutiérrez)
- **Email**: tic-300078@utnay.edu.mx (Gustavo Adolfo Nava Meraz)  
- **Email**: tic-300170@utnay.edu.mx (Jesus Cruz Figueroa)

**Nota importante**: 
- Todos los usuarios en esta base de datos tienen permisos de administrador
- Las contraseñas están hasheadas en la base de datos remota
- Contacta al administrador del sistema para obtener las contraseñas

## Características principales

- Autenticación de usuarios (solo administradores)
- Control de acceso basado en roles
- Gestión de pedidos
- Gestión de productos
- Dashboard con estadísticas
- Panel de administración seguro

## Tecnologías utilizadas

- **Backend**:
  - Node.js
  - Express
  - MySQL
  - JSON Web Tokens (JWT)

- **Frontend**:
  - React
  - React Router
  - Framer Motion
  - Lucide React




