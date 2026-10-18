// Textos de los correos del pedido. Se arman aqui, sin depender de Medusa,
// para poder probarlos solos.

export const TIENDA = {
  nombre: "DENVER Librería",
  razonSocial: "IMPORTADORA Y MULTISERVICIOS DENVER S.A.C.",
  whatsapp: "942 295 923",
  whatsappLink: "https://wa.me/51942295923",
}

const INSTRUCCIONES_PAGO: Record<string, string> = {
  pp_manual_yape: `Yapea o plinea el total al ${TIENDA.whatsapp} (DENVER) y envíanos la captura por WhatsApp con tu número de pedido. Despachamos cuando confirmamos el pago.`,
  pp_manual_recojo:
    "Pagas en efectivo, Yape o tarjeta cuando recoges tu pedido en la tienda. Te escribimos por WhatsApp cuando esté listo.",
}

const NOMBRE_PAGO: Record<string, string> = {
  pp_manual_yape: "Yape o Plin",
  pp_manual_recojo: "Pago al recoger en tienda",
}

export type PedidoCorreo = {
  display_id: number | string
  email?: string | null
  total: number
  shipping_total?: number
  items: {
    title: string
    subtitle?: string | null
    quantity: number
    total: number
  }[]
  shipping_address?: {
    first_name?: string | null
    last_name?: string | null
    address_1?: string | null
    city?: string | null
    phone?: string | null
  } | null
  shipping_methods?: { name: string }[]
  metadata?: Record<string, unknown> | null
  proveedor_pago?: string | null
}

export type Correo = { asunto: string; html: string; texto: string }

const soles = (monto: number) => `S/ ${Number(monto).toFixed(2)}`

const escapar = (texto: unknown) =>
  String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

function textoComprobante(metadata?: Record<string, unknown> | null) {
  if (!metadata?.comprobante) {
    return "Sin comprobante"
  }
  return metadata.comprobante === "factura"
    ? `Factura a ${metadata.razon_social} (RUC ${metadata.documento})`
    : `Boleta a DNI o CE ${metadata.documento}`
}

function resumen(pedido: PedidoCorreo) {
  const direccion = pedido.shipping_address
  const proveedor = pedido.proveedor_pago ?? ""
  return {
    nombre: [direccion?.first_name, direccion?.last_name]
      .filter(Boolean)
      .join(" "),
    entrega:
      pedido.shipping_methods?.map((m) => m.name).join(", ") ||
      "Sin método de entrega",
    direccion: [direccion?.address_1, direccion?.city]
      .filter(Boolean)
      .join(", "),
    telefono: direccion?.phone ?? "",
    pago: NOMBRE_PAGO[proveedor] ?? proveedor,
    instrucciones: INSTRUCCIONES_PAGO[proveedor] ?? "",
    comprobante: textoComprobante(pedido.metadata),
  }
}

function tablaItems(pedido: PedidoCorreo) {
  const celda = "padding:6px 0"
  const filas = pedido.items
    .map((item) => {
      const variante = item.subtitle
        ? ` <span style="color:#666">(${escapar(item.subtitle)})</span>`
        : ""
      return `<tr><td style="${celda}">${item.quantity} x ${escapar(item.title)}${variante}</td><td style="${celda};text-align:right">${soles(item.total)}</td></tr>`
    })
    .join("")
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${filas}
<tr><td style="${celda};border-top:1px solid #ddd">Envío</td><td style="${celda};border-top:1px solid #ddd;text-align:right">${soles(pedido.shipping_total ?? 0)}</td></tr>
<tr><td style="${celda};font-weight:bold">Total (IGV incluido)</td><td style="${celda};text-align:right;font-weight:bold">${soles(pedido.total)}</td></tr></table>`
}

function plantilla(titulo: string, cuerpo: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f8;font-family:Arial,sans-serif;color:#1a1a1a">
<div style="max-width:560px;margin:0 auto;background:#fff">
<div style="background:#0A1B5C;padding:20px 24px;color:#fff;font-size:20px;font-weight:bold">DENVER <span style="color:#FFE11F;font-size:12px;letter-spacing:3px">LIBRERÍA</span></div>
<div style="padding:24px"><h1 style="font-size:20px;margin:0 0 16px">${titulo}</h1>${cuerpo}</div>
<div style="padding:16px 24px;background:#0A1B5C;color:#cfd6f5;font-size:12px">${TIENDA.razonSocial} · WhatsApp <a style="color:#FFE11F" href="${TIENDA.whatsappLink}">${TIENDA.whatsapp}</a></div>
</div></body></html>`
}

function datos(r: ReturnType<typeof resumen>) {
  const fila = (etiqueta: string, valor: string) =>
    valor
      ? `<p style="margin:4px 0;font-size:14px"><b>${etiqueta}:</b> ${escapar(valor)}</p>`
      : ""
  return [
    fila("Entrega", r.entrega),
    fila("Dirección", r.direccion),
    fila("Teléfono", r.telefono),
    fila("Pago", r.pago),
    fila("Comprobante", r.comprobante),
  ].join("")
}

// Correo al cliente cuando hace el pedido.
export function correoCliente(pedido: PedidoCorreo): Correo {
  const r = resumen(pedido)
  const tipo = pedido.metadata?.comprobante === "factura" ? "factura" : "boleta"
  const instrucciones = r.instrucciones
    ? `<div style="background:#FFF8CC;border-left:4px solid #FFE11F;padding:12px 16px;margin:16px 0;font-size:14px">${escapar(r.instrucciones)}</div>`
    : ""
  const saludo = r.nombre ? `¡Gracias, ${escapar(r.nombre)}!` : "¡Gracias!"
  const html = plantilla(
    `${saludo} Recibimos tu pedido N.º ${pedido.display_id}`,
    `${instrucciones}${tablaItems(pedido)}<div style="margin-top:16px">${datos(r)}</div>
<p style="font-size:14px;margin-top:16px">Te enviaremos tu ${tipo} electrónica cuando confirmemos el pago. Si tienes dudas, escríbenos por <a href="${TIENDA.whatsappLink}">WhatsApp</a>.</p>`
  )
  const texto = [
    `Gracias por tu compra. Pedido N.º ${pedido.display_id}.`,
    r.instrucciones,
    ...pedido.items.map((i) => `${i.quantity} x ${i.title}: ${soles(i.total)}`),
    `Envío: ${soles(pedido.shipping_total ?? 0)}`,
    `Total (IGV incluido): ${soles(pedido.total)}`,
    `Entrega: ${r.entrega}`,
    `Pago: ${r.pago}`,
    `Comprobante: ${r.comprobante}`,
    `WhatsApp: ${TIENDA.whatsapp}`,
  ]
    .filter(Boolean)
    .join("\n")
  return {
    asunto: `Recibimos tu pedido N.º ${pedido.display_id} en DENVER`,
    html,
    texto,
  }
}

// Aviso a la tienda de un pedido nuevo.
export function correoTienda(pedido: PedidoCorreo): Correo {
  const r = resumen(pedido)
  const html = plantilla(
    `Pedido nuevo N.º ${pedido.display_id}`,
    `<p style="font-size:14px"><b>Cliente:</b> ${escapar(r.nombre)} · ${escapar(pedido.email)}</p>${datos(r)}<div style="margin-top:16px">${tablaItems(pedido)}</div>`
  )
  const texto = [
    `Pedido nuevo N.º ${pedido.display_id}`,
    `Cliente: ${r.nombre} (${pedido.email ?? ""}) ${r.telefono}`,
    `Entrega: ${r.entrega} ${r.direccion}`,
    `Pago: ${r.pago}`,
    `Comprobante: ${r.comprobante}`,
    ...pedido.items.map((i) => `${i.quantity} x ${i.title}: ${soles(i.total)}`),
    `Total: ${soles(pedido.total)}`,
  ].join("\n")
  return {
    asunto: `Pedido nuevo N.º ${pedido.display_id}: ${soles(pedido.total)} con ${r.pago}`,
    html,
    texto,
  }
}
