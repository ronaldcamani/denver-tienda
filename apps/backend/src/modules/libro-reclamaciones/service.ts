import { MedusaService } from "@medusajs/framework/utils"
import Reclamo from "./models/reclamo"

// La clave "Hoja" da metodos como createHojas o listAndCountHojas (con
// "Reclamo" Medusa los pluraliza en ingles: createReclamoes).
class LibroReclamacionesService extends MedusaService({ Hoja: Reclamo }) {}

export default LibroReclamacionesService
