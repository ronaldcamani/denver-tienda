import { z } from "@medusajs/framework/zod"

const texto = (max: number) => z.string().trim().min(1).max(max)

export const CrearReclamo = z.object({
  tipo: z.enum(["reclamo", "queja"]),
  nombre: texto(200),
  tipo_documento: z.enum(["dni", "ce", "pasaporte", "ruc"]),
  documento: texto(20),
  domicilio: texto(300),
  telefono: texto(30),
  email: z.string().trim().email(),
  apoderado: z.string().trim().max(200).optional().nullable(),
  bien: z.enum(["producto", "servicio"]),
  monto: z.coerce.number().min(0).optional().nullable(),
  descripcion_bien: texto(500),
  numero_pedido: z.string().trim().max(30).optional().nullable(),
  detalle: texto(3000),
  pedido_consumidor: texto(1500),
  acepta: z.literal(true),
})

export type CrearReclamoBody = z.infer<typeof CrearReclamo>
