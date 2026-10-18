import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import { errorComprobante } from "../../lib/comprobante"

const RECOJO_EN_TIENDA = "Recojo en tienda"

// Antes de crear el pedido: que tenga boleta o factura con su documento, y que
// el pago al recoger solo se use cuando el pedido se recoge en tienda.
completeCartWorkflow.hooks.validate(async ({ cart }) => {
  const error = errorComprobante(cart.metadata ?? {})
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
  }

  const pagaAlRecoger = cart.payment_collection?.payment_sessions?.some(
    (sesion) => sesion?.provider_id === "pp_manual_recojo"
  )
  const recogeEnTienda = cart.shipping_methods?.some(
    (metodo) => metodo?.name === RECOJO_EN_TIENDA
  )
  if (pagaAlRecoger && !recogeEnTienda) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "El pago al recoger solo está disponible si recoges el pedido en la tienda."
    )
  }
})
