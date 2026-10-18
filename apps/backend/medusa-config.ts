import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

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
