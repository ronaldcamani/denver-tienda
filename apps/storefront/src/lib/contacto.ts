// Datos de contacto de DENVER, tomados del afiche de la tienda.
export const WHATSAPP_NUMEROS = ["942 295 923", "902 022 295"]
export const WHATSAPP_VISIBLE = WHATSAPP_NUMEROS[0]
export const WHATSAPP_URL = `https://wa.me/51${WHATSAPP_VISIBLE.replace(
  /\s/g,
  ""
)}?text=${encodeURIComponent("Hola DENVER, quiero hacer una consulta.")}`

export const SERVICIOS = [
  { titulo: "Copias", detalle: "Libros y expedientes, 6 x S/ 0.30" },
  {
    titulo: "Impresiones y plotter",
    detalle: "Formatos A5, A4, A3, A2, A1 y A0",
  },
  { titulo: "Escaneos", detalle: "Documentos y planos" },
  { titulo: "Anillados y enmicados", detalle: "Listos en el día" },
]
