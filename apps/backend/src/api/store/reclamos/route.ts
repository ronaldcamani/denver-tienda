import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { correoReclamo } from "../../../lib/correos"
import { LIBRO_RECLAMACIONES } from "../../../modules/libro-reclamaciones"
import LibroReclamacionesService from "../../../modules/libro-reclamaciones/service"
import { CrearReclamoBody } from "./validators"

// Registra una hoja del Libro de Reclamaciones y envia la constancia al
// consumidor y a la tienda.
export async function POST(
  req: MedusaRequest<CrearReclamoBody>,
  res: MedusaResponse
) {
  const libro: LibroReclamacionesService = req.scope.resolve(LIBRO_RECLAMACIONES)
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const { acepta: _acepta, ...datos } = req.validatedBody

  const reclamo = await libro.createHojas(datos)

  const correo = correoReclamo(reclamo)
  const destinos = [reclamo.email, process.env.CORREO_TIENDA].filter(
    (d): d is string => !!d
  )
  try {
    await req.scope.resolve(Modules.NOTIFICATION).createNotifications(
      destinos.map((to) => ({
        to,
        channel: "email",
        template: "libro-reclamaciones",
        content: { subject: correo.asunto, html: correo.html, text: correo.texto },
        resource_id: reclamo.id,
        resource_type: "reclamo",
      }))
    )
  } catch (error) {
    logger.error(`No se pudo enviar la constancia del reclamo ${reclamo.numero}: ${error}`)
  }

  res.status(201).json({
    reclamo: { numero: reclamo.numero, created_at: reclamo.created_at },
  })
}
