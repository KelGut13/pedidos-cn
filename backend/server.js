const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos y modelos
const { testConnection, query } = require('./config/database');
const PedidoModel = require('./models/PedidoModel');
const DatabaseInitializer = require('./config/initializer');

// Importar rutas
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:3002',
        'https://api.curiosidadesnancy.shop',
        'https://curiosidadesnancy.shop'
    ], // Permitir solicitudes desde múltiples puertos y el servidor de admin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({ 
        message: 'Servidor backend de Pedidos CN funcionando correctamente',
        port: PORT,
        database: 'MySQL conectado',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);

// Ruta proxy para imágenes del servidor de admin
app.get('/api/images/*', async (req, res) => {
    try {
        const imagePath = req.params[0];
        const imageUrl = `https://api.curiosidadesnancy.shop/uploads/${imagePath}`;
        
        // Hacer una petición al servidor de admin para obtener la imagen
        const axios = require('axios');
        const response = await axios.get(imageUrl, {
            responseType: 'stream'
        });
        
        // Reenviar la imagen al cliente
        response.data.pipe(res);
    } catch (error) {
        console.error('Error al obtener imagen:', error);
        res.status(404).json({ error: 'Imagen no encontrada' });
    }
});

// Ruta de salud de la base de datos
app.get('/api/health/db', async (req, res) => {
    try {
        const isConnected = await testConnection();
        res.json({
            success: true,
            database: isConnected ? 'Conectado' : 'Desconectado',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al verificar conexión de base de datos',
            timestamp: new Date().toISOString()
        });
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Algo salió mal en el servidor' 
    });
});

// Ruta para manejar 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Ruta no encontrada' 
    });
});

// Función para inicializar la base de datos
async function initializeDatabase() {
    try {
        console.log('🔄 Inicializando conexión a base de datos...');
        
        // Probar conexión
        const isConnected = await testConnection();
        if (!isConnected) {
            console.log('⚠️  Servidor iniciado sin base de datos - algunas funciones pueden no estar disponibles');
            return false;
        }

        // Verificar que la tabla pedidos existe
        try {
            await query('SELECT 1 FROM pedidos LIMIT 1');
            console.log('✅ Tabla "pedidos" verificada exitosamente');
        } catch (error) {
            console.log('❌ Error: la tabla "pedidos" no existe en la base de datos');
            return false;
        }
        
        // Inicializar datos de la base de datos
        console.log('🔄 Iniciando inicialización de la base de datos...');
        await DatabaseInitializer.initialize();
        
        console.log('✅ Base de datos inicializada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        console.log('⚠️  Servidor iniciado sin base de datos - algunas funciones pueden no estar disponibles');
        return false;
    }
}

// Iniciar el servidor
async function startServer() {
    try {
        // Intentar inicializar base de datos (no es fatal si falla)
        const dbConnected = await initializeDatabase();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
            console.log(`📱 Frontend corriendo en http://localhost:3002`);
            if (dbConnected) {
                console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
                console.log(`🌐 Host DB: ${process.env.DB_HOST}`);
            } else {
                console.log(`⚠️  Base de datos no conectada - configurar .env para funcionalidad completa`);
            }
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    const { closeConnection } = require('./config/database');
    await closeConnection();
    process.exit(0);
});

// Iniciar la aplicación
startServer();
