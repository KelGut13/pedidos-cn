-- Script para insertar datos de prueba en la base de datos joyeria
-- Ejecutar después de importar la estructura de la base de datos

-- Insertar roles básicos
INSERT INTO roles (ID_rol, nombre_rol) VALUES 
(1, 'Administrador'),
(2, 'Cliente')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

-- Insertar usuario administrador de prueba
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO usuarios (nombre, email, password, telefono, id_rol) VALUES 
('Administrador Sistema', 'admin@pedidoscn.com', '$2a$10$rOvwZ8kYq8mxVpL1kQV4XuVJ8wQJZ5nN8fX6mY2hQ1sK9rT3vW7ei', '5555555555', 1)
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    telefono = VALUES(telefono),
    id_rol = VALUES(id_rol);

-- Insertar un usuario cliente de prueba
INSERT INTO usuarios (nombre, email, password, telefono, id_rol) VALUES 
('Juan Pérez', 'cliente@test.com', '$2a$10$rOvwZ8kYq8mxVpL1kQV4XuVJ8wQJZ5nN8fX6mY2hQ1sK9rT3vW7ei', '5551234567', 2)
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    telefono = VALUES(telefono),
    id_rol = VALUES(id_rol);

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre_categoria) VALUES 
('Anillos'),
('Collares'),
('Pulseras'),
('Aretes'),
('Relojes')
ON DUPLICATE KEY UPDATE nombre_categoria = VALUES(nombre_categoria);

-- Insertar marcas de ejemplo
INSERT INTO marcas (nombre_marca) VALUES 
('Pandora'),
('Swarovski'),
('Tiffany & Co'),
('Cartier'),
('Rolex')
ON DUPLICATE KEY UPDATE nombre_marca = VALUES(nombre_marca);

-- Insertar materiales de ejemplo
INSERT INTO material (nombre_material) VALUES 
('Oro 18k'),
('Plata 925'),
('Acero Inoxidable'),
('Platino'),
('Titanio')
ON DUPLICATE KEY UPDATE nombre_material = VALUES(nombre_material);

-- Insertar géneros
INSERT INTO genero (nombre_genero) VALUES 
('Femenino'),
('Masculino'),
('Unisex')
ON DUPLICATE KEY UPDATE nombre_genero = VALUES(nombre_genero);

-- Insertar métodos de pago
INSERT INTO metodo_pago (nombre_metodo) VALUES 
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PayPal'),
('Transferencia Bancaria'),
('Efectivo')
ON DUPLICATE KEY UPDATE nombre_metodo = VALUES(nombre_metodo);

COMMIT;
