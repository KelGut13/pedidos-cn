const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas de este router - Solo administradores
router.use(authenticateAdmin);

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.getAllProductos);

// GET /api/productos/search - Buscar productos
router.get('/search', ProductoController.searchProductos);

// GET /api/productos/stock-bajo - Productos con stock bajo
router.get('/stock-bajo', ProductoController.getProductosStockBajo);

// GET /api/productos/categoria/:idCategoria - Productos por categoría
router.get('/categoria/:idCategoria', ProductoController.getProductosByCategoria);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', ProductoController.getProductoById);

module.exports = router;
