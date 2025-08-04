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
            const { ID_usuario, ID_direccion, total, estado } = req.body;

            // Validaciones
            if (!ID_usuario || !total) {
                return res.status(400).json({
                    success: false,
                    error: 'ID_usuario y total son campos requeridos'
                });
            }

            const nuevoPedido = await PedidoModel.createPedido({
                ID_usuario,
                ID_direccion,
                total,
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
            const { estado, total } = req.body;

            // Verificar que el pedido existe
            const pedidoExistente = await PedidoModel.getPedidoById(id);
            if (!pedidoExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Pedido no encontrado'
                });
            }

            // Validaciones
            if (!estado && !total) {
                return res.status(400).json({
                    success: false,
                    error: 'Debe proporcionar al menos estado o total para actualizar'
                });
            }

            const pedidoActualizado = await PedidoModel.updatePedido(id, {
                estado: estado || pedidoExistente.estado,
                total: total || pedidoExistente.total
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
            const estadosValidos = ['pendiente', 'completado', 'cancelado', 'enviado', 'entregado'];

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

    // Obtener pedidos por usuario
    static async getPedidosByUsuario(req, res) {
        try {
            const { idUsuario } = req.params;

            if (!idUsuario || isNaN(idUsuario)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de usuario no válido'
                });
            }

            const pedidos = await PedidoModel.getPedidosByUsuario(idUsuario);
            
            res.json({
                success: true,
                data: pedidos,
                count: pedidos.length,
                id_usuario: parseInt(idUsuario)
            });
        } catch (error) {
            console.error('Error en getPedidosByUsuario:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener pedidos del usuario'
            });
        }
    }

    // Obtener estadísticas de pedidos
    static async getEstadisticasPedidos(req, res) {
        try {
            const estadisticas = await PedidoModel.getEstadisticasPedidos();
            
            res.json({
                success: true,
                data: {
                    ...estadisticas,
                    monto_total: parseFloat(estadisticas.monto_total) || 0,
                    monto_promedio: parseFloat(estadisticas.monto_promedio) || 0
                }
            });
        } catch (error) {
            console.error('Error en getEstadisticasPedidos:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener estadísticas'
            });
        }
    }
}

module.exports = PedidoController;
