import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

type Hoja = {
  id: string
  numero: number
  tipo: "reclamo" | "queja"
  nombre: string
  tipo_documento: string
  documento: string
  domicilio: string
  telefono: string
  email: string
  apoderado: string | null
  bien: string
  monto: number | null
  descripcion_bien: string
  numero_pedido: string | null
  detalle: string
  pedido_consumidor: string
  respuesta: string | null
  fecha_respuesta: string | null
  created_at: string
}

const DIA = 24 * 60 * 60 * 1000

// Dias habiles (lunes a viernes) desde el registro; el plazo legal es 15.
function diasHabiles(desde: string) {
  let dias = 0
  for (let t = new Date(desde).getTime() + DIA; t <= Date.now(); t += DIA) {
    const dia = new Date(t).getDay()
    if (dia !== 0 && dia !== 6) dias++
  }
  return dias
}

const fecha = (valor: string) =>
  new Date(valor).toLocaleString("es-PE", { timeZone: "America/Lima" })

// Usa HTML con las clases de @medusajs/ui porque sus componentes chocan con
// los tipos de React del storefront en este monorepo.
const LibroReclamaciones = () => {
  const [hojas, setHojas] = useState<Hoja[] | null>(null)
  const [abierta, setAbierta] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = () =>
    fetch("/admin/reclamos", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setHojas(d.reclamos))
      .catch((e) => setError(String(e)))

  useEffect(() => {
    cargar()
  }, [])

  const responder = async (id: string) => {
    setEnviando(true)
    setError(null)
    const r = await fetch(`/admin/reclamos/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ respuesta }),
    })
    setEnviando(false)
    if (!r.ok) {
      setError((await r.json()).message ?? "No se pudo guardar la respuesta.")
      return
    }
    setRespuesta("")
    setAbierta(null)
    cargar()
  }

  return (
    <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y">
      <div className="px-6 py-4">
        <h1 className="font-sans font-medium h1-core text-ui-fg-base">
          Libro de Reclamaciones
        </h1>
        <p className="txt-small text-ui-fg-subtle">
          Hay que responder cada hoja en un máximo de 15 días hábiles. La
          respuesta se envía al correo del consumidor.
        </p>
      </div>
      {error && <p className="px-6 py-3 txt-small text-ui-fg-error">{error}</p>}
      {hojas === null && <p className="px-6 py-4 txt-small">Cargando...</p>}
      {hojas?.length === 0 && (
        <p className="px-6 py-4 txt-small text-ui-fg-subtle">
          No hay reclamos ni quejas registrados.
        </p>
      )}
      {hojas?.map((h) => {
        const dias = diasHabiles(h.created_at)
        const pendiente = !h.respuesta
        return (
          <div key={h.id} className="px-6 py-4 txt-small">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setAbierta(abierta === h.id ? null : h.id)}
            >
              <span>
                <span className="txt-small-plus text-ui-fg-base">
                  N.º {String(h.numero).padStart(6, "0")} ·{" "}
                  {h.tipo === "queja" ? "Queja" : "Reclamo"}
                </span>{" "}
                <span className="text-ui-fg-subtle">
                  {h.nombre} · {fecha(h.created_at)}
                </span>
              </span>
              <span
                className={
                  pendiente
                    ? dias >= 10
                      ? "text-ui-fg-error"
                      : "text-ui-tag-orange-text"
                    : "text-ui-tag-green-text"
                }
              >
                {pendiente ? `Pendiente (${dias} de 15 días hábiles)` : "Respondido"}
              </span>
            </button>
            {abierta === h.id && (
              <div className="mt-3 flex flex-col gap-y-2 text-ui-fg-subtle">
                <p>
                  {h.tipo_documento.toUpperCase()} {h.documento} · {h.telefono} ·{" "}
                  {h.email}
                </p>
                <p>Domicilio: {h.domicilio}</p>
                {h.apoderado && <p>Apoderado: {h.apoderado}</p>}
                <p>
                  {h.bien === "producto" ? "Producto" : "Servicio"}:{" "}
                  {h.descripcion_bien}
                  {h.monto != null && ` · S/ ${Number(h.monto).toFixed(2)}`}
                  {h.numero_pedido && ` · Pedido ${h.numero_pedido}`}
                </p>
                <p className="text-ui-fg-base">Detalle: {h.detalle}</p>
                <p className="text-ui-fg-base">Pide: {h.pedido_consumidor}</p>
                {h.respuesta ? (
                  <p className="text-ui-fg-base">
                    Respuesta ({h.fecha_respuesta && fecha(h.fecha_respuesta)}):{" "}
                    {h.respuesta}
                  </p>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    <textarea
                      className="bg-ui-bg-field shadow-borders-base rounded-md px-3 py-2 txt-small text-ui-fg-base min-h-[100px]"
                      placeholder="Respuesta para el consumidor"
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                    />
                    <button
                      className="self-start rounded-md bg-ui-button-inverted px-3 py-1.5 txt-compact-small-plus text-ui-fg-on-inverted disabled:opacity-50"
                      disabled={enviando || !respuesta.trim()}
                      onClick={() => responder(h.id)}
                    >
                      {enviando ? "Enviando..." : "Guardar y enviar respuesta"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Reclamaciones",
})

export default LibroReclamaciones
