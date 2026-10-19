# Pedidos CN

Panel web de administración de pedidos, productos y usuarios. React consume una API Express conectada a MySQL.

## Desarrollo

Instala dependencias en la raíz y en `backend/`. Copia `backend/.env.example` a `backend/.env`, configura una base de pruebas y un `JWT_SECRET` único. Ejecuta frontend y backend con los scripts de sus respectivos `package.json`.

```sh
npm install
npm --prefix backend install
npm --prefix backend start
# En otra terminal:
npm start
```

El frontend configura la API en `src/services/api.js`. Verifica sus URLs antes de iniciar. Los archivos SQL son datos de ejemplo y no garantizan un esquema completo; utiliza únicamente una base local descartable.

## Autorización

Las rutas administrativas comprueban el rol almacenado en `usuarios`: `ID_rol=1` es administrador, según los roles definidos en el inicializador. No basta con que un token declare ser administrador. Las contraseñas deben almacenarse con bcrypt; se eliminó la compatibilidad con contraseñas en texto plano. Las cuentas antiguas requieren una migración segura si conservan ese formato.

Se retiraron las utilidades temporales que permitían listar personal o modificar contraseñas sin autenticación, el acceso ficticio de diagnóstico y las copias de controladores en desuso. Los fixtures utilizan direcciones de ejemplo.

```sh
npm run test:security
```

Las pruebas de autorización no acceden a MySQL y verifican que un cliente no obtenga privilegios administrativos aunque su token los declare.

Estado: proyecto en desarrollo, pendiente de revisar el esquema completo, los modelos de usuarios y las operaciones administrativas de extremo a extremo. No usar como panel de producción sin completar esa validación. La anonimización de la rama actual no elimina datos de commits anteriores.
