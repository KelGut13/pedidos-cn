const ProductoModel = require('../models/ProductoModel');

class ProductoController {
    // Obtener todos los productos
    static async getAllProductos(req, res) {
        try {
            const productos = await ProductoModel.getAllProductos();
            res.json({
                success: true,
                data: productos,
                count: productos.length
            });
        } catch (error) {
            console.error('Error en getAllProductos:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener productos'
            });
        }
    }

    // Obtener un producto por ID
    static async getProductoById(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductoModel.getProductoById(id);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    error: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('Error en getProductoById:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener el producto'
            });
        }
    }

    // Obtener productos por categoría
    static async getProductosByCategoria(req, res) {
        try {
            const { idCategoria } = req.params;
            const productos = await ProductoModel.getProductosByCategoria(idCategoria);
            
            res.json({
                success: true,
                data: productos,
                count: productos.length,
                categoria_id: parseInt(idCategoria)
            });
        } catch (error) {
            console.error('Error en getProductosByCategoria:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener productos por categoría'
            });
        }
    }

    // Buscar productos
    static async searchProductos(req, res) {
        try {
            const { q } = req.query;
            
            if (!q || q.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'El término de búsqueda debe tener al menos 2 caracteres'
                });
            }

            const productos = await ProductoModel.searchProductos(q.trim());
            
            res.json({
                success: true,
                data: productos,
                count: productos.length,
                query: q.trim()
            });
        } catch (error) {
            console.error('Error en searchProductos:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al buscar productos'
            });
        }
    }

    // Obtener productos con stock bajo
    static async getProductosStockBajo(req, res) {
        try {
            const { limite } = req.query;
            const limiteStock = limite ? parseInt(limite) : 10;
            
            const productos = await ProductoModel.getProductosStockBajo(limiteStock);
            
            res.json({
                success: true,
                data: productos,
                count: productos.length,
                limite_stock: limiteStock
            });
        } catch (error) {
            console.error('Error en getProductosStockBajo:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener productos con stock bajo'
            });
        }
    }
}

module.exports = ProductoController;
