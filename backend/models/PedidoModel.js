const { query } = require('../config/database');

class PedidoModel {
    // Obtener todos los pedidos
    static async getAllPedidos() {
        try {
            const sql = `
                SELECT 
                    id,
                    cliente,
                    producto,
                    estado,
                    fecha_creacion,
                    fecha_actualizacion
                FROM pedidos 
                ORDER BY fecha_creacion DESC
            `;
            return await query(sql);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            throw error;
        }
    }

    // Obtener un pedido por ID
    static async getPedidoById(id) {
        try {
            const sql = `
                SELECT 
                    id,
                    cliente,
                    producto,
                    estado,
                    fecha_creacion,
                    fecha_actualizacion
                FROM pedidos 
                WHERE id = ?
            `;
            const results = await query(sql, [id]);
            return results[0] || null;
        } catch (error) {
            console.error('Error al obtener pedido por ID:', error);
            throw error;
        }
    }

    // Crear un nuevo pedido
    static async createPedido(pedidoData) {
        try {
            const { cliente, producto, estado = 'pendiente' } = pedidoData;
            
            const sql = `
                INSERT INTO pedidos (cliente, producto, estado, fecha_creacion, fecha_actualizacion)
                VALUES (?, ?, ?, NOW(), NOW())
            `;
            
            const result = await query(sql, [cliente, producto, estado]);
            
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
            const { cliente, producto, estado } = pedidoData;
            
            const sql = `
                UPDATE pedidos 
                SET cliente = ?, producto = ?, estado = ?, fecha_actualizacion = NOW()
                WHERE id = ?
            `;
            
            await query(sql, [cliente, producto, estado, id]);
            
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
            const sql = 'DELETE FROM pedidos WHERE id = ?';
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
                    id,
                    cliente,
                    producto,
                    estado,
                    fecha_creacion,
                    fecha_actualizacion
                FROM pedidos 
                WHERE estado = ?
                ORDER BY fecha_creacion DESC
            `;
            return await query(sql, [estado]);
        } catch (error) {
            console.error('Error al obtener pedidos por estado:', error);
            throw error;
        }
    }

    // Verificar si existe la tabla y crearla si no existe
    static async initializeTable() {
        try {
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS pedidos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente VARCHAR(255) NOT NULL,
                    producto VARCHAR(255) NOT NULL,
                    estado ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `;
            
            await query(createTableSQL);
            console.log('✅ Tabla "pedidos" verificada/creada exitosamente');
        } catch (error) {
            console.error('❌ Error al crear/verificar tabla pedidos:', error);
            throw error;
        }
    }
}

module.exports = PedidoModel;
