import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CreateNotificationDTO } from "@medusajs/framework/types"
import { PedidoCorreo, correoCliente, correoTienda } from "../lib/correos"

// Al crearse un pedido: correo de confirmacion al cliente y aviso a la tienda
// (CORREO_TIENDA). Sin SMTP configurado, los correos solo salen en el log.
export default async function pedidoRealizado({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificaciones = container.resolve(Modules.NOTIFICATION)

  const {
    data: [pedido],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "metadata",
      "total",
      "shipping_total",
      "items.title",
      "items.subtitle",
      "items.quantity",
      "items.total",
      "shipping_address.*",
      "shipping_methods.name",
      "payment_collections.payments.provider_id",
    ],
    filters: { id: data.id },
  })
  if (!pedido) {
    logger.warn(`No se encontro el pedido ${data.id} para enviar correos.`)
    return
  }

  const datos = {
    ...pedido,
    proveedor_pago:
      pedido.payment_collections?.[0]?.payments?.[0]?.provider_id ?? null,
  } as unknown as PedidoCorreo

  const envios: CreateNotificationDTO[] = []
  if (pedido.email) {
    const correo = correoCliente(datos)
    envios.push({
      to: pedido.email,
      channel: "email",
      template: "pedido-cliente",
      content: { subject: correo.asunto, html: correo.html, text: correo.texto },
      resource_id: pedido.id,
      resource_type: "order",
    })
  }
  if (process.env.CORREO_TIENDA) {
    const correo = correoTienda(datos)
    envios.push({
      to: process.env.CORREO_TIENDA,
      channel: "email",
      template: "pedido-tienda",
      content: { subject: correo.asunto, html: correo.html, text: correo.texto },
      resource_id: pedido.id,
      resource_type: "order",
    })
  }

  // Un correo que falla no debe tumbar el pedido; queda en el log.
  try {
    await notificaciones.createNotifications(envios)
  } catch (error) {
    logger.error(`No se pudieron enviar los correos del pedido ${pedido.display_id}: ${error}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
