import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { correoRespuestaReclamo } from "../../../../lib/correos"
import { LIBRO_RECLAMACIONES } from "../../../../modules/libro-reclamaciones"
import LibroReclamacionesService from "../../../../modules/libro-reclamaciones/service"

// Guarda la respuesta de la tienda y se la envia al consumidor por correo.
export async function POST(
  req: MedusaRequest<{ respuesta: string }>,
  res: MedusaResponse
) {
  const libro: LibroReclamacionesService = req.scope.resolve(LIBRO_RECLAMACIONES)
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  const reclamo = await libro.updateHojas({
    id: req.params.id,
    respuesta: req.validatedBody.respuesta,
    fecha_respuesta: new Date(),
  })

  const correo = correoRespuestaReclamo(reclamo)
  try {
    await req.scope.resolve(Modules.NOTIFICATION).createNotifications([
      {
        to: reclamo.email,
        channel: "email",
        template: "libro-reclamaciones-respuesta",
        content: { subject: correo.asunto, html: correo.html, text: correo.texto },
        resource_id: reclamo.id,
        resource_type: "reclamo",
      },
    ])
  } catch (error) {
    logger.error(`No se pudo enviar la respuesta del reclamo ${reclamo.numero}: ${error}`)
  }

  res.json({ reclamo })
}
