const express = require('express');
const PedidoController = require('../controllers/PedidoController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas de este router - Solo administradores
router.use(authenticateAdmin);

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', PedidoController.obtenerTodos);

// GET /api/pedidos/estadisticas - Obtener estadísticas de pedidos
router.get('/estadisticas', PedidoController.obtenerEstadisticas);

// GET /api/pedidos/buscar - Buscar pedidos
router.get('/buscar', PedidoController.buscar);

// GET /api/pedidos/estado/:estado - Obtener pedidos por estado
router.get('/estado/:estado', PedidoController.obtenerPorEstado);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get('/:id', PedidoController.obtenerPorId);

// PUT /api/pedidos/:id/estado - Actualizar estado de un pedido
router.put('/:id/estado', PedidoController.actualizarEstado);

module.exports = router;
