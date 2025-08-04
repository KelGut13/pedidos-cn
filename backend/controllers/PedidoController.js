const PedidoModel = require('../models/PedidoModel');

class PedidoController {
    // Obtener todos los pedidos
    static async getAllPedidos(req, res) {
        try {
            const pedidos = await PedidoModel.getAllPedidos();
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length
            });
        } catch (error) {
            console.error('Error en getAllPedidos:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener pedidos'
            });
        }
    }

    // Obtener un pedido por ID
    static async getPedidoById(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidoModel.getPedidoById(id);
            
            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    error: 'Pedido no encontrado'
                });
            }

            res.json({
                success: true,
                data: pedido
            });
        } catch (error) {
            console.error('Error en getPedidoById:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener el pedido'
            });
        }
    }

    // Crear un nuevo pedido
    static async createPedido(req, res) {
        try {
            const { cliente, producto, estado } = req.body;

            // Validaciones
            if (!cliente || !producto) {
                return res.status(400).json({
                    success: false,
                    error: 'Cliente y producto son campos requeridos'
                });
            }

            const nuevoPedido = await PedidoModel.createPedido({
                cliente,
                producto,
                estado
            });

            res.status(201).json({
                success: true,
                data: nuevoPedido,
                message: 'Pedido creado exitosamente'
            });
        } catch (error) {
            console.error('Error en createPedido:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al crear el pedido'
            });
        }
    }

    // Actualizar un pedido
    static async updatePedido(req, res) {
        try {
            const { id } = req.params;
            const { cliente, producto, estado } = req.body;

            // Verificar que el pedido existe
            const pedidoExistente = await PedidoModel.getPedidoById(id);
            if (!pedidoExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Pedido no encontrado'
                });
            }

            // Validaciones
            if (!cliente || !producto || !estado) {
                return res.status(400).json({
                    success: false,
                    error: 'Cliente, producto y estado son campos requeridos'
                });
            }

            const pedidoActualizado = await PedidoModel.updatePedido(id, {
                cliente,
                producto,
                estado
            });

            res.json({
                success: true,
                data: pedidoActualizado,
                message: 'Pedido actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error en updatePedido:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al actualizar el pedido'
            });
        }
    }

    // Eliminar un pedido
    static async deletePedido(req, res) {
        try {
            const { id } = req.params;

            // Verificar que el pedido existe
            const pedidoExistente = await PedidoModel.getPedidoById(id);
            if (!pedidoExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Pedido no encontrado'
                });
            }

            const eliminado = await PedidoModel.deletePedido(id);

            if (eliminado) {
                res.json({
                    success: true,
                    message: 'Pedido eliminado exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al eliminar el pedido'
                });
            }
        } catch (error) {
            console.error('Error en deletePedido:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al eliminar el pedido'
            });
        }
    }

    // Obtener pedidos por estado
    static async getPedidosByEstado(req, res) {
        try {
            const { estado } = req.params;
            const estadosValidos = ['pendiente', 'en_proceso', 'completado', 'cancelado'];

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    error: 'Estado no válido. Estados permitidos: ' + estadosValidos.join(', ')
                });
            }

            const pedidos = await PedidoModel.getPedidosByEstado(estado);
            
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length,
                estado: estado
            });
        } catch (error) {
            console.error('Error en getPedidosByEstado:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener pedidos por estado'
            });
        }
    }
}

module.exports = PedidoController;
