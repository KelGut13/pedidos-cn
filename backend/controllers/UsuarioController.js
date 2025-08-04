const UsuarioModel = require('../models/UsuarioModel');

class UsuarioController {
    // Obtener todos los usuarios
    static async getAllUsuarios(req, res) {
        try {
            const usuarios = await UsuarioModel.getAllUsuarios();
            res.json({
                success: true,
                data: usuarios,
                count: usuarios.length
            });
        } catch (error) {
            console.error('Error en getAllUsuarios:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener usuarios'
            });
        }
    }

    // Obtener un usuario por ID
    static async getUsuarioById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioModel.getUsuarioById(id);
            
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: usuario
            });
        } catch (error) {
            console.error('Error en getUsuarioById:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al obtener el usuario'
            });
        }
    }

    // Crear un nuevo usuario
    static async createUsuario(req, res) {
        try {
            const { nombre, email, password, telefono, id_rol } = req.body;

            // Validaciones básicas
            if (!nombre || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre, email y password son campos requeridos'
                });
            }

            // Verificar si el email ya existe
            const emailExiste = await UsuarioModel.emailExists(email);
            if (emailExiste) {
                return res.status(409).json({
                    success: false,
                    error: 'El email ya está registrado'
                });
            }

            const nuevoUsuario = await UsuarioModel.createUsuario({
                nombre,
                email,
                password, // En producción, esto debería estar hasheado
                telefono,
                id_rol
            });

            // Remover password de la respuesta
            const { password: _, ...usuarioSinPassword } = nuevoUsuario;

            res.status(201).json({
                success: true,
                data: usuarioSinPassword,
                message: 'Usuario creado exitosamente'
            });
        } catch (error) {
            console.error('Error en createUsuario:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al crear el usuario'
            });
        }
    }
}

module.exports = UsuarioController;
