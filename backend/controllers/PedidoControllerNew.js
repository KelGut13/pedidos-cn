const PedidoModel = require('../models/PedidoModel');

class PedidoController {
    // Obtener todos los pedidos
    static async obtenerTodos(req, res) {
        try {
            const pedidos = await PedidoModel.obtenerTodos();
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length
            });
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedidos',
                error: error.message
            });
        }
    }

    // Obtener un pedido por ID
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidoModel.obtenerPorId(id);
            
            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado'
                });
            }

            res.json({
                success: true,
                data: pedido
            });
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedido',
                error: error.message
            });
        }
    }

    // Actualizar estado de un pedido
    static async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            if (!estado) {
                return res.status(400).json({
                    success: false,
                    message: 'El estado es requerido'
                });
            }

            const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado no válido'
                });
            }

            await PedidoModel.actualizarEstado(id, estado);

            res.json({
                success: true,
                message: 'Estado actualizado correctamente'
            });
        } catch (error) {
            console.error('Error en actualizarEstado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar estado',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de pedidos
    static async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await PedidoModel.obtenerEstadisticas();
            res.json({
                success: true,
                data: estadisticas
            });
        } catch (error) {
            console.error('Error en obtenerEstadisticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    }

    // Filtrar pedidos por estado
    static async obtenerPorEstado(req, res) {
        try {
            const { estado } = req.params;
            const pedidos = await PedidoModel.obtenerPorEstado(estado);
            
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length
            });
        } catch (error) {
            console.error('Error en obtenerPorEstado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedidos por estado',
                error: error.message
            });
        }
    }

    // Buscar pedidos
    static async buscar(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Término de búsqueda requerido'
                });
            }

            const pedidos = await PedidoModel.buscar(q);
            
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length
            });
        } catch (error) {
            console.error('Error en buscar:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar pedidos',
                error: error.message
            });
        }
    }
}

module.exports = PedidoController;
