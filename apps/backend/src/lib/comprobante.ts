// Datos del comprobante que el cliente elige en el checkout. Se guardan en la
// metadata del carrito y pasan al pedido, para emitir la boleta o factura en
// SUNAT SOL. La misma validacion esta en el storefront (lib/util/comprobante).

export type DatosComprobante = {
  comprobante?: unknown
  documento?: unknown
  razon_social?: unknown
}

const RUC = /^(10|15|17|20)\d{9}$/
// DNI de 8 digitos o carne de extranjeria de 9 a 12 caracteres.
const DOCUMENTO_BOLETA = /^(\d{8}|[A-Z0-9]{9,12})$/

export function errorComprobante(datos: DatosComprobante): string | null {
  const documento = String(datos.documento ?? "")
  const razonSocial = String(datos.razon_social ?? "").trim()

  if (datos.comprobante === "factura") {
    if (!RUC.test(documento)) {
      return "Para factura escribe un RUC de 11 dígitos."
    }
    if (!razonSocial) {
      return "Para factura escribe la razón social."
    }
    return null
  }
  if (datos.comprobante === "boleta") {
    if (!DOCUMENTO_BOLETA.test(documento)) {
      return "Para boleta escribe tu DNI de 8 dígitos o tu carné de extranjería."
    }
    return null
  }
  return "Elige si quieres boleta o factura."
}
