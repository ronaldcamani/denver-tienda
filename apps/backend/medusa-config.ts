import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Correos por SMTP cuando estan las variables (ver .env.template); si no, se
// escriben en el log para probar en local sin enviar nada.
const correo = process.env.SMTP_HOST
  ? {
      resolve: './src/modules/correo-smtp',
      id: 'smtp',
      options: {
        channels: ['email'],
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
      },
    }
  : {
      resolve: '@medusajs/medusa/notification-local',
      id: 'local',
      options: { channels: ['email'] },
    }

// En el servidor (ver deploy/) Redis guarda eventos y flujos para que no se
// pierdan al reiniciar. Sin REDIS_URL se usan las versiones en memoria.
const redisUrl = process.env.REDIS_URL
const conRedis = redisUrl
  ? [
      {
        resolve: '@medusajs/medusa/event-bus-redis',
        options: { redisUrl },
      },
      {
        resolve: '@medusajs/medusa/workflow-engine-redis',
        options: { redis: { redisUrl } },
      },
    ]
  : []

// Las fotos subidas en el panel se guardan en static/ y se sirven desde la
// direccion publica del backend.
const backendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    ...conRedis,
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-local',
            id: 'local',
            options: { backend_url: `${backendUrl}/static` },
          },
        ],
      },
    },
    { resolve: './src/modules/libro-reclamaciones' },
    {
      resolve: '@medusajs/medusa/notification',
      options: { providers: [correo] },
    },
    {
      // Medios de pago que la tienda confirma a mano: pp_manual_yape y
      // pp_manual_recojo. Izipay se agrega aqui cuando haya cuenta.
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          { resolve: './src/modules/pago-manual', id: 'yape' },
          { resolve: './src/modules/pago-manual', id: 'recojo' },
        ],
      },
    },
  ],
})
