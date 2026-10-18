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

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
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
