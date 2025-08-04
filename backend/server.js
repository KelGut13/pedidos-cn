const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos y modelos
const { testConnection } = require('./config/database');
const PedidoModel = require('./models/PedidoModel');

// Importar rutas
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin: 'http://localhost:3002', // Permitir solicitudes desde el frontend
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
            throw new Error('No se pudo conectar a la base de datos');
        }

        // Inicializar tablas
        await PedidoModel.initializeTable();
        
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        process.exit(1);
    }
}

// Iniciar el servidor
async function startServer() {
    try {
        // Inicializar base de datos primero
        await initializeDatabase();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
            console.log(`📱 Frontend esperado en http://localhost:3002`);
            console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
            console.log(`🌐 Host DB: ${process.env.DB_HOST}`);
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
