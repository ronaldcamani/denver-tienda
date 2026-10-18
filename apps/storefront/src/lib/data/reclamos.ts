"use server"

import { sdk } from "@lib/config"

export type EstadoReclamo =
  | { ok: true; numero: number; fecha: string }
  | { ok: false; error: string }
  | null

const texto = (formData: FormData, campo: string) =>
  String(formData.get(campo) ?? "").trim()

// Envia la hoja del Libro de Reclamaciones al backend, que la guarda y manda
// la constancia por correo.
export async function registrarReclamo(
  _estado: EstadoReclamo,
  formData: FormData
): Promise<EstadoReclamo> {
  if (formData.get("acepta") !== "on") {
    return { ok: false, error: "Marca la casilla de conformidad para enviar." }
  }
  const monto = texto(formData, "monto")
  const body = {
    tipo: texto(formData, "tipo"),
    nombre: texto(formData, "nombre"),
    tipo_documento: texto(formData, "tipo_documento"),
    documento: texto(formData, "documento"),
    domicilio: texto(formData, "domicilio"),
    telefono: texto(formData, "telefono"),
    email: texto(formData, "email"),
    apoderado: texto(formData, "apoderado") || null,
    bien: texto(formData, "bien"),
    monto: monto ? Number(monto.replace(",", ".")) : null,
    descripcion_bien: texto(formData, "descripcion_bien"),
    numero_pedido: texto(formData, "numero_pedido") || null,
    detalle: texto(formData, "detalle"),
    pedido_consumidor: texto(formData, "pedido_consumidor"),
    acepta: true,
  }

  try {
    const { reclamo } = await sdk.client.fetch<{
      reclamo: { numero: number; created_at: string }
    }>("/store/reclamos", { method: "POST", body })
    return { ok: true, numero: reclamo.numero, fecha: reclamo.created_at }
  } catch {
    return {
      ok: false,
      error:
        "No pudimos registrar tu reclamo. Revisa que todos los campos estén completos y vuelve a intentarlo.",
    }
  }
}
