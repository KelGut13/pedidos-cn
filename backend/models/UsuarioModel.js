const { query } = require('../config/database');

class UsuarioModel {
    // Obtener todos los usuarios
    static async getAllUsuarios() {
        try {
            const sql = `
                SELECT 
                    u.ID_usuario,
                    u.nombre,
                    u.primer_apellido,
                    u.segundo_apellido,
                    u.email,
                    u.telefono,
                    2 as ID_rol,
                    'Administrador' as nombre_rol
                FROM usuarios u
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
                    u.primer_apellido,
                    u.segundo_apellido,
                    u.email,
                    u.telefono,
                    2 as ID_rol,
                    'Administrador' as nombre_rol
                FROM usuarios u
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
            console.log('🔍 UsuarioModel.getUsuarioByEmail:', email);
            const sql = `
                SELECT 
                    u.ID_usuario,
                    u.nombre,
                    u.primer_apellido,
                    u.segundo_apellido,
                    u.email,
                    u.password,
                    u.telefono,
                    2 as ID_rol,
                    'Administrador' as nombre_rol
                FROM usuarios u
                WHERE u.email = ?
            `;
            const results = await query(sql, [email]);
            console.log('📊 Query resultado:', { encontrado: !!results[0], cantidad: results.length });
            return results[0] || null;
        } catch (error) {
            console.error('💥 Error al obtener usuario por email:', error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async createUsuario(userData) {
        try {
            const { nombre, email, password, telefono, ID_rol = 2 } = userData; // Rol 2 = cliente por defecto
            
            // Hashear la contraseña antes de guardarla
            const hashedPassword = await this.hashPassword(password);
            
            const sql = `
                INSERT INTO usuarios (nombre, email, password, telefono, ID_rol)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const result = await query(sql, [nombre, email, hashedPassword, telefono, ID_rol]);
            
            return await this.getUsuarioById(result.insertId);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }
    
    // Utility method to hash password
    static async hashPassword(password) {
        const bcrypt = require('bcryptjs');
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
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
