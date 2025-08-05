const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const router = express.Router();

// Endpoint para actualizar contraseña temporalmente
router.post('/update-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Email y nueva contraseña son requeridos'
            });
        }
        
        // Verificar si el personal existe
        const checkQuery = 'SELECT * FROM personal WHERE email_pe = ?';
        const [personal] = await db.execute(checkQuery, [email]);
        
        if (personal.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Personal no encontrado'
            });
        }
        
        console.log('Personal encontrado:', personal[0]);        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
                // Actualizar la contraseña
        const updateQuery = 'UPDATE personal SET password_pe = ? WHERE email_pe = ?';
        const [result] = await db.execute(updateQuery, [hashedPassword, email]);
        
        res.json({
            success: true,
            message: 'Contraseña actualizada correctamente',
            email: email
        });
        
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Ruta para listar todo el personal
router.get('/list-users', async (req, res) => {
    try {
        const query = 'SELECT ID_personal, ID_usuario, nombres_pe, primer_apellido_pe, segundo_apellido_pe, email_pe, telefono_pe FROM personal';
        const [personal] = await db.execute(query);
        
        res.json({
            success: true,
            personal: personal
        });
        
    } catch (error) {
        console.error('Error listando personal:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor: ' + error.message
        });
    }
});

module.exports = router;
