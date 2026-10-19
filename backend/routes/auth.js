const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// POST /api/auth/login - Login de usuario
router.post('/login', AuthController.login);


// POST /api/auth/validar-token - Validar token JWT
router.post('/validar-token', AuthController.validarToken);

// GET /api/auth/test - Endpoint de prueba
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API de autenticación funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
