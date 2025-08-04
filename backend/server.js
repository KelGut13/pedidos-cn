const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
        timestamp: new Date().toISOString()
    });
});

// Ruta de ejemplo para pedidos
app.get('/api/pedidos', (req, res) => {
    res.json([
        { id: 1, cliente: 'Cliente 1', producto: 'Producto A', estado: 'pendiente' },
        { id: 2, cliente: 'Cliente 2', producto: 'Producto B', estado: 'completado' }
    ]);
});

// Ruta para crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
    const { cliente, producto } = req.body;
    
    if (!cliente || !producto) {
        return res.status(400).json({ 
            error: 'Cliente y producto son requeridos' 
        });
    }
    
    const nuevoPedido = {
        id: Date.now(),
        cliente,
        producto,
        estado: 'pendiente',
        fecha: new Date().toISOString()
    };
    
    res.status(201).json(nuevoPedido);
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Ruta para manejar 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`📱 Frontend esperado en http://localhost:3002`);
});

module.exports = app;
