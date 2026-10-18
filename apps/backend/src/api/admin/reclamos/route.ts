import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LIBRO_RECLAMACIONES } from "../../../modules/libro-reclamaciones"
import LibroReclamacionesService from "../../../modules/libro-reclamaciones/service"

// Hojas del Libro de Reclamaciones, de la mas reciente a la mas antigua.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const libro: LibroReclamacionesService = req.scope.resolve(LIBRO_RECLAMACIONES)
  const [reclamos, count] = await libro.listAndCountHojas(
    {},
    { order: { numero: "DESC" }, take: 100 }
  )
  res.json({ reclamos, count })
}
