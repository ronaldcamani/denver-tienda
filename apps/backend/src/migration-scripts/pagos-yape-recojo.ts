import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

// Deja en la region Peru los medios de pago que la tienda confirma a mano y
// quita el pago manual de prueba. Corre una sola vez con `medusa db:migrate`.
export const PAGOS_PERU = ["pp_manual_yape", "pp_manual_recojo"]

export default async function pagos_yape_recojo({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regiones } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { currency_code: "pen" },
  })
  if (!regiones.length) {
    logger.info("No hay region en soles todavia; no se cambian los pagos.")
    return
  }

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: regiones.map((r) => r.id) },
      update: { payment_providers: PAGOS_PERU },
    },
  })
  logger.info(`Pagos Yape o Plin y recojo activados en ${regiones.length} region(es).`)
}
