import { model } from "@medusajs/framework/utils"

// Hoja del Libro de Reclamaciones virtual (Codigo de Proteccion y Defensa del
// Consumidor, Ley 29571, y su reglamento D.S. 011-2011-PCM). `numero` es el
// correlativo que se le da al consumidor.
const Reclamo = model.define("reclamo", {
  id: model.id({ prefix: "recl" }).primaryKey(),
  numero: model.autoincrement(),
  tipo: model.enum(["reclamo", "queja"]),
  nombre: model.text(),
  tipo_documento: model.enum(["dni", "ce", "pasaporte", "ruc"]),
  documento: model.text(),
  domicilio: model.text(),
  telefono: model.text(),
  email: model.text(),
  apoderado: model.text().nullable(),
  bien: model.enum(["producto", "servicio"]),
  monto: model.float().nullable(),
  descripcion_bien: model.text(),
  numero_pedido: model.text().nullable(),
  detalle: model.text(),
  pedido_consumidor: model.text(),
  respuesta: model.text().nullable(),
  fecha_respuesta: model.dateTime().nullable(),
})

export default Reclamo
