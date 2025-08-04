const express = require('express');
const PedidoController = require('../controllers/PedidoController');

const router = express.Router();

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', PedidoController.getAllPedidos);

// GET /api/pedidos/estadisticas - Obtener estadísticas de pedidos
router.get('/estadisticas', PedidoController.getEstadisticasPedidos);

// GET /api/pedidos/estado/:estado - Obtener pedidos por estado
router.get('/estado/:estado', PedidoController.getPedidosByEstado);

// GET /api/pedidos/usuario/:idUsuario - Obtener pedidos por usuario
router.get('/usuario/:idUsuario', PedidoController.getPedidosByUsuario);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get('/:id', PedidoController.getPedidoById);

// POST /api/pedidos - Crear un nuevo pedido
router.post('/', PedidoController.createPedido);

// PUT /api/pedidos/:id - Actualizar un pedido
router.put('/:id', PedidoController.updatePedido);

// DELETE /api/pedidos/:id - Eliminar un pedido
router.delete('/:id', PedidoController.deletePedido);

module.exports = router;
