const { query } = require('../config/database');

class PedidoModel {
    // Obtener todos los pedidos con información relacionada
    static async getAllPedidos() {
        try {
            const sql = `
                SELECT 
                    p.ID_pedido as id,
                    p.ID_usuario,
                    p.ID_direccion,
                    p.fecha,
                    p.total,
                    p.estado,
                    u.nombre as cliente_nombre,
                    u.email as cliente_email,
                    u.telefono as cliente_telefono,
                    CONCAT(d.calle, ' ', d.numero_exterior, 
                           IFNULL(CONCAT(' Int. ', d.numero_interior), ''), 
                           ', ', d.colonia, ', ', d.ciudad, ', ', d.estado) as direccion_completa
                FROM pedidos p
                INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
                LEFT JOIN direcciones d ON p.ID_direccion = d.ID_direccion
                ORDER BY p.fecha DESC
            `;
            return await query(sql);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            throw error;
        }
    }

    // Obtener un pedido por ID con detalles completos
    static async getPedidoById(id) {
        try {
            const sql = `
                SELECT 
                    p.ID_pedido as id,
                    p.ID_usuario,
                    p.ID_direccion,
                    p.fecha,
                    p.total,
                    p.estado,
                    u.nombre as cliente_nombre,
                    u.email as cliente_email,
                    u.telefono as cliente_telefono,
                    d.alias as direccion_alias,
                    d.calle,
                    d.numero_exterior,
                    d.numero_interior,
                    d.colonia,
                    d.ciudad,
                    d.estado as direccion_estado,
                    d.codigo_postal,
                    d.pais
                FROM pedidos p
                INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
                LEFT JOIN direcciones d ON p.ID_direccion = d.ID_direccion
                WHERE p.ID_pedido = ?
            `;
            const results = await query(sql, [id]);
            
            if (results.length > 0) {
                // Obtener detalles del pedido
                const detalles = await this.getDetallesPedido(id);
                return {
                    ...results[0],
                    detalles
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error al obtener pedido por ID:', error);
            throw error;
        }
    }

    // Obtener detalles de un pedido (productos)
    static async getDetallesPedido(idPedido) {
        try {
            const sql = `
                SELECT 
                    dp.ID_detalle,
                    dp.cantidad,
                    dp.precio_unitario,
                    pr.ID_producto,
                    pr.nombre as producto_nombre,
                    pr.descripcion as producto_descripcion,
                    pr.imagen as producto_imagen,
                    m.nombre_marca,
                    mt.nombre_material,
                    c.nombre_categoria,
                    g.nombre_genero
                FROM detalle_pedido dp
                INNER JOIN productos pr ON dp.ID_producto = pr.ID_producto
                LEFT JOIN marcas m ON pr.id_marca = m.ID_marca
                LEFT JOIN material mt ON pr.id_material = mt.ID_material
                LEFT JOIN categorias c ON pr.id_categoria = c.ID_categoria
                LEFT JOIN genero g ON pr.id_genero = g.ID_genero
                WHERE dp.ID_pedido = ?
            `;
            return await query(sql, [idPedido]);
        } catch (error) {
            console.error('Error al obtener detalles del pedido:', error);
            throw error;
        }
    }

    // Crear un nuevo pedido (simplificado para demo)
    static async createPedido(pedidoData) {
        try {
            const { ID_usuario, ID_direccion, total, estado = 'pendiente' } = pedidoData;
            
            const sql = `
                INSERT INTO pedidos (ID_usuario, ID_direccion, fecha, total, estado)
                VALUES (?, ?, NOW(), ?, ?)
            `;
            
            const result = await query(sql, [ID_usuario, ID_direccion, total, estado]);
            
            // Retornar el pedido creado
            return await this.getPedidoById(result.insertId);
        } catch (error) {
            console.error('Error al crear pedido:', error);
            throw error;
        }
    }

    // Actualizar un pedido
    static async updatePedido(id, pedidoData) {
        try {
            const { estado, total } = pedidoData;
            
            const sql = `
                UPDATE pedidos 
                SET estado = ?, total = ?
                WHERE ID_pedido = ?
            `;
            
            await query(sql, [estado, total, id]);
            
            // Retornar el pedido actualizado
            return await this.getPedidoById(id);
        } catch (error) {
            console.error('Error al actualizar pedido:', error);
            throw error;
        }
    }

    // Eliminar un pedido
    static async deletePedido(id) {
        try {
            // Primero eliminar detalles del pedido
            await query('DELETE FROM detalle_pedido WHERE ID_pedido = ?', [id]);
            
            // Luego eliminar el pedido
            const sql = 'DELETE FROM pedidos WHERE ID_pedido = ?';
            const result = await query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
            throw error;
        }
    }

    // Obtener pedidos por estado
    static async getPedidosByEstado(estado) {
        try {
            const sql = `
                SELECT 
                    p.ID_pedido as id,
                    p.ID_usuario,
                    p.ID_direccion,
                    p.fecha,
                    p.total,
                    p.estado,
                    u.nombre as cliente_nombre,
                    u.email as cliente_email,
                    CONCAT(d.calle, ' ', d.numero_exterior, ', ', d.colonia, ', ', d.ciudad) as direccion_completa
                FROM pedidos p
                INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
                LEFT JOIN direcciones d ON p.ID_direccion = d.ID_direccion
                WHERE p.estado = ?
                ORDER BY p.fecha DESC
            `;
            return await query(sql, [estado]);
        } catch (error) {
            console.error('Error al obtener pedidos por estado:', error);
            throw error;
        }
    }

    // Obtener pedidos por usuario
    static async getPedidosByUsuario(idUsuario) {
        try {
            const sql = `
                SELECT 
                    p.ID_pedido as id,
                    p.fecha,
                    p.total,
                    p.estado,
                    COUNT(dp.ID_detalle) as total_productos
                FROM pedidos p
                LEFT JOIN detalle_pedido dp ON p.ID_pedido = dp.ID_pedido
                WHERE p.ID_usuario = ?
                GROUP BY p.ID_pedido
                ORDER BY p.fecha DESC
            `;
            return await query(sql, [idUsuario]);
        } catch (error) {
            console.error('Error al obtener pedidos por usuario:', error);
            throw error;
        }
    }

    // Obtener estadísticas de pedidos
    static async getEstadisticasPedidos() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_pedidos,
                    SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                    SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completados,
                    SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as cancelados,
                    SUM(total) as monto_total,
                    AVG(total) as monto_promedio
                FROM pedidos
            `;
            const results = await query(sql);
            return results[0];
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    // Verificar si la tabla existe (la tabla ya existe en el esquema)
    static async initializeTable() {
        try {
            // Solo verificar que la tabla existe
            const sql = 'DESCRIBE pedidos';
            await query(sql);
            console.log('✅ Tabla "pedidos" verificada exitosamente');
        } catch (error) {
            console.error('❌ Error: la tabla "pedidos" no existe en la base de datos');
            throw error;
        }
    }
}

module.exports = PedidoModel;
