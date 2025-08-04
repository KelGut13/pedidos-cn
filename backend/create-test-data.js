const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Usuarios de prueba
const usuariosPrueba = [
  {
    nombre: 'María',
    primer_apellido: 'García',
    segundo_apellido: 'López',
    email: 'maria.garcia@gmail.com',
    password: '$2b$10$dummy.hash.for.testing',
    telefono: '5551234567'
  },
  {
    nombre: 'Carlos',
    primer_apellido: 'Rodríguez',
    segundo_apellido: 'Martínez',
    email: 'carlos.rodriguez@hotmail.com',
    password: '$2b$10$dummy.hash.for.testing',
    telefono: '5559876543'
  },
  {
    nombre: 'Ana',
    primer_apellido: 'López',
    segundo_apellido: 'Fernández',
    email: 'ana.lopez@yahoo.com',
    password: '$2b$10$dummy.hash.for.testing',
    telefono: '5554567890'
  },
  {
    nombre: 'José',
    primer_apellido: 'Martínez',
    segundo_apellido: 'Cruz',
    email: 'jose.martinez@outlook.com',
    password: '$2b$10$dummy.hash.for.testing',
    telefono: '5553219876'
  },
  {
    nombre: 'Laura',
    primer_apellido: 'Fernández',
    segundo_apellido: 'Gutiérrez',
    email: 'laura.fernandez@gmail.com',
    password: '$2b$10$dummy.hash.for.testing',
    telefono: '5556543210'
  }
];

// Direcciones de prueba (una por usuario)
const direccionesPrueba = [
  {
    alias: 'Casa',
    calle: 'Av. Reforma',
    numero_exterior: '123',
    numero_interior: 'A',
    colonia: 'Centro',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigo_postal: '06000',
    pais: 'México',
    predeterminada: 1
  },
  {
    alias: 'Casa',
    calle: 'Calle Juárez',
    numero_exterior: '456',
    numero_interior: '',
    colonia: 'Roma Norte',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigo_postal: '06700',
    pais: 'México',
    predeterminada: 1
  },
  {
    alias: 'Casa',
    calle: 'Privada de las Flores',
    numero_exterior: '789',
    numero_interior: '5',
    colonia: 'Coyoacán',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigo_postal: '04000',
    pais: 'México',
    predeterminada: 1
  },
  {
    alias: 'Casa',
    calle: 'Blvd. Manuel Ávila Camacho',
    numero_exterior: '321',
    numero_interior: 'Piso 2',
    colonia: 'Polanco',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigo_postal: '11560',
    pais: 'México',
    predeterminada: 1
  },
  {
    alias: 'Casa',
    calle: 'Av. Insurgentes Sur',
    numero_exterior: '159',
    numero_interior: '',
    colonia: 'Condesa',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigo_postal: '06140',
    pais: 'México',
    predeterminada: 1
  }
];

// Pedidos de prueba
const pedidosPrueba = [
  {
    usuarioIndex: 0, // María García
    fecha: '2024-01-15 10:30:00',
    total: 1450.00,
    estado: 'pendiente',
    productos: [
      { id_producto: 1, cantidad: 2, precio_unitario: 250.00 }, // Arete corazón
      { id_producto: 40, cantidad: 1, precio_unitario: 1200.00 }, // Anillo Corazón Oro
    ]
  },
  {
    usuarioIndex: 1, // Carlos Rodríguez
    fecha: '2024-01-14 14:15:00',
    total: 950.00,
    estado: 'procesando',
    productos: [
      { id_producto: 45, cantidad: 1, precio_unitario: 950.00 }, // Aretes Aro Oro
    ]
  },
  {
    usuarioIndex: 2, // Ana López
    fecha: '2024-01-13 09:45:00',
    total: 1330.00,
    estado: 'enviado',
    productos: [
      { id_producto: 46, cantidad: 1, precio_unitario: 780.00 }, // Collar Corazón Plata
      { id_producto: 47, cantidad: 1, precio_unitario: 550.00 }, // Pulsera Trenzada Hombre
    ]
  },
  {
    usuarioIndex: 3, // José Martínez
    fecha: '2024-01-12 16:20:00',
    total: 750.00,
    estado: 'entregado',
    productos: [
      { id_producto: 43, cantidad: 1, precio_unitario: 300.00 }, // Pulsera Ajustable Unisex
      { id_producto: 42, cantidad: 1, precio_unitario: 450.00 }, // Collar Cruz Acero
    ]
  },
  {
    usuarioIndex: 4, // Laura Fernández
    fecha: '2024-01-16 11:10:00',
    total: 1150.00,
    estado: 'pendiente',
    productos: [
      { id_producto: 41, cantidad: 1, precio_unitario: 650.00 }, // Aretes Luna Plata
      { id_producto: 44, cantidad: 1, precio_unitario: 500.00 }, // Anillo Minimalista Plata
    ]
  }
];

async function crearDatosPrueba() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión establecida');

    // Verificar si ya existen usuarios de prueba
    const [existingUsers] = await connection.execute(
      'SELECT COUNT(*) as count FROM usuarios WHERE email IN (?, ?, ?, ?, ?)',
      usuariosPrueba.map(u => u.email)
    );
    
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Algunos usuarios de prueba ya existen');
      console.log('🔄 Continuando con la creación de datos...');
    }

    console.log('� Creando usuarios de prueba...');
    const usuarioIds = [];
    
    for (let i = 0; i < usuariosPrueba.length; i++) {
      const usuario = usuariosPrueba[i];
      
      // Verificar si el usuario ya existe
      const [existing] = await connection.execute(
        'SELECT ID_usuario FROM usuarios WHERE email = ?',
        [usuario.email]
      );
      
      if (existing.length > 0) {
        usuarioIds.push(existing[0].ID_usuario);
        console.log(`   ↩️  Usuario ${usuario.nombre} ${usuario.primer_apellido} ya existe (ID: ${existing[0].ID_usuario})`);
      } else {
        const [result] = await connection.execute(
          `INSERT INTO usuarios (nombre, primer_apellido, segundo_apellido, email, password, telefono) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [usuario.nombre, usuario.primer_apellido, usuario.segundo_apellido, 
           usuario.email, usuario.password, usuario.telefono]
        );
        usuarioIds.push(result.insertId);
        console.log(`   ✅ Usuario ${usuario.nombre} ${usuario.primer_apellido} creado (ID: ${result.insertId})`);
      }
    }

    console.log('\n🏠 Creando direcciones...');
    const direccionIds = [];
    
    for (let i = 0; i < direccionesPrueba.length; i++) {
      const direccion = direccionesPrueba[i];
      const usuarioId = usuarioIds[i];
      
      // Verificar si ya existe una dirección para este usuario
      const [existingDir] = await connection.execute(
        'SELECT ID_direccion FROM direcciones WHERE ID_usuario = ?',
        [usuarioId]
      );
      
      if (existingDir.length > 0) {
        direccionIds.push(existingDir[0].ID_direccion);
        console.log(`   ↩️  Dirección para usuario ${usuarioId} ya existe (ID: ${existingDir[0].ID_direccion})`);
      } else {
        const [result] = await connection.execute(
          `INSERT INTO direcciones (ID_usuario, alias, calle, numero_exterior, numero_interior, 
                                   colonia, ciudad, estado, codigo_postal, pais, predeterminada) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [usuarioId, direccion.alias, direccion.calle, direccion.numero_exterior, 
           direccion.numero_interior, direccion.colonia, direccion.ciudad, 
           direccion.estado, direccion.codigo_postal, direccion.pais, direccion.predeterminada]
        );
        direccionIds.push(result.insertId);
        console.log(`   ✅ Dirección creada para usuario ${usuarioId} (ID: ${result.insertId})`);
      }
    }

    console.log('\n📦 Creando pedidos...');
    
    for (let i = 0; i < pedidosPrueba.length; i++) {
      const pedido = pedidosPrueba[i];
      const usuarioId = usuarioIds[pedido.usuarioIndex];
      const direccionId = direccionIds[pedido.usuarioIndex];
      
      console.log(`\n➡️  Creando pedido ${i + 1} para usuario ${usuarioId}`);
      
      // Insertar el pedido
      const [result] = await connection.execute(
        `INSERT INTO pedidos (ID_usuario, ID_direccion, fecha, total, estado) 
         VALUES (?, ?, ?, ?, ?)`,
        [usuarioId, direccionId, pedido.fecha, pedido.total, pedido.estado]
      );
      
      const pedidoId = result.insertId;
      console.log(`   ✅ Pedido creado con ID: ${pedidoId}`);
      
      // Insertar los productos del pedido
      for (const producto of pedido.productos) {
        await connection.execute(
          `INSERT INTO detalle_pedido (ID_pedido, ID_producto, cantidad, precio_unitario) 
           VALUES (?, ?, ?, ?)`,
          [pedidoId, producto.id_producto, producto.cantidad, producto.precio_unitario]
        );
        console.log(`   📦 Producto ${producto.id_producto} agregado (Cantidad: ${producto.cantidad})`);
      }
    }

    // Mostrar resumen
    console.log('\n📊 RESUMEN:');
    const [totalUsuarios] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
    const [totalDirecciones] = await connection.execute('SELECT COUNT(*) as count FROM direcciones');
    const [totalPedidos] = await connection.execute('SELECT COUNT(*) as count FROM pedidos');
    const [totalDetalles] = await connection.execute('SELECT COUNT(*) as count FROM detalle_pedido');
    
    console.log(`👥 Total de usuarios: ${totalUsuarios[0].count}`);
    console.log(`🏠 Total de direcciones: ${totalDirecciones[0].count}`);
    console.log(`📦 Total de pedidos: ${totalPedidos[0].count}`);
    console.log(`�️  Total de productos en pedidos: ${totalDetalles[0].count}`);
    
    // Mostrar pedidos por estado
    const [estadosSummary] = await connection.execute(`
      SELECT estado, COUNT(*) as cantidad 
      FROM pedidos 
      GROUP BY estado 
      ORDER BY cantidad DESC
    `);
    
    console.log('\n📈 Pedidos por estado:');
    estadosSummary.forEach(estado => {
      console.log(`   ${estado.estado}: ${estado.cantidad} pedidos`);
    });

    console.log('\n🎉 ¡Datos de prueba creados exitosamente!');
    console.log('🌐 Puedes ver los pedidos en: http://localhost:3002/pedidos');

  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  crearDatosPrueba();
}

module.exports = { crearDatosPrueba };
