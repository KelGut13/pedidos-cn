const { query } = require('../config/database');

class UsuarioModel {
    // Obtener todos los usuarios
    static async getAllUsuarios() {
        try {
            const sql = `
                SELECT 
                    u.ID_usuario,
                    u.nombre,
                    u.email,
                    u.telefono,
                    r.nombre_rol
                FROM usuarios u
                INNER JOIN roles r ON u.id_rol = r.ID_rol
                ORDER BY u.nombre
            `;
            return await query(sql);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    // Obtener un usuario por ID
    static async getUsuarioById(id) {
        try {
            const sql = `
                SELECT 
                    u.ID_usuario,
                    u.nombre,
                    u.email,
                    u.telefono,
                    u.id_rol,
                    r.nombre_rol
                FROM usuarios u
                INNER JOIN roles r ON u.id_rol = r.ID_rol
                WHERE u.ID_usuario = ?
            `;
            const results = await query(sql, [id]);
            return results[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    }

    // Obtener usuario por email
    static async getUsuarioByEmail(email) {
        try {
            const sql = `
                SELECT 
                    u.ID_usuario,
                    u.nombre,
                    u.email,
                    u.password,
                    u.telefono,
                    u.id_rol,
                    r.nombre_rol
                FROM usuarios u
                INNER JOIN roles r ON u.id_rol = r.ID_rol
                WHERE u.email = ?
            `;
            const results = await query(sql, [email]);
            return results[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario por email:', error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async createUsuario(userData) {
        try {
            const { nombre, email, password, telefono, id_rol = 2 } = userData; // Rol 2 = cliente por defecto
            
            const sql = `
                INSERT INTO usuarios (nombre, email, password, telefono, id_rol)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const result = await query(sql, [nombre, email, password, telefono, id_rol]);
            
            return await this.getUsuarioById(result.insertId);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Verificar si un email ya está registrado
    static async emailExists(email) {
        try {
            const sql = 'SELECT ID_usuario FROM usuarios WHERE email = ?';
            const results = await query(sql, [email]);
            return results.length > 0;
        } catch (error) {
            console.error('Error al verificar email:', error);
            throw error;
        }
    }
}

module.exports = UsuarioModel;
