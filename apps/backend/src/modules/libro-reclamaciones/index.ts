import { Module } from "@medusajs/framework/utils"
import LibroReclamacionesService from "./service"

export const LIBRO_RECLAMACIONES = "libroReclamaciones"

export default Module(LIBRO_RECLAMACIONES, {
  service: LibroReclamacionesService,
})
