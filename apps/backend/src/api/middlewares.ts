import {
  configureStoreSearch,
  defineMiddlewares,
  validateAndTransformBody,
} from '@medusajs/framework/http'
import { z } from '@medusajs/framework/zod'
import { CrearReclamo } from './store/reclamos/validators'

export default defineMiddlewares({
  routes: [
    // The product index declares filterable `status` and `sales_channel_ids`, so
    // the route narrows it to published products in the key's sales channels.
    {
      method: ['POST'],
      matcher: '/store/search',
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    {
      method: ['POST'],
      matcher: '/store/reclamos',
      middlewares: [validateAndTransformBody(CrearReclamo)],
    },
    {
      method: ['POST'],
      matcher: '/admin/reclamos/:id',
      middlewares: [
        validateAndTransformBody(
          z.object({ respuesta: z.string().trim().min(1).max(3000) })
        ),
      ],
    },
  ],
})
