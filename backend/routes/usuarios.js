const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', UsuarioController.getAllUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', UsuarioController.getUsuarioById);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', UsuarioController.createUsuario);

module.exports = router;
