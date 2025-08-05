const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios (solo admin)
router.get('/', authenticateAdmin, UsuarioController.getAllUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID (solo admin)
router.get('/:id', authenticateAdmin, UsuarioController.getUsuarioById);

// POST /api/usuarios - Crear un nuevo usuario (público para registro)

module.exports = router;
