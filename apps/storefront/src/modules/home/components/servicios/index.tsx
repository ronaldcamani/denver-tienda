import { DocumentText, Photo, Swatch, Book } from "@medusajs/icons"
import { SERVICIOS, WHATSAPP_URL } from "@lib/contacto"

const ICONOS = [DocumentText, Photo, Swatch, Book]
const COLORES = [
  "bg-denver-600",
  "bg-[#E91E63]",
  "bg-[#2E9E3E]",
  "bg-[#7B2CBF]",
]

const Servicios = () => {
  return (
    <section className="content-container py-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-bold text-denver-900">
          Servicios en nuestra librería
        </h2>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="txt-compact-small-plus text-denver-600 hover:underline"
        >
          Cotiza por WhatsApp
        </a>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-3">
        {SERVICIOS.map((s, i) => {
          const Icono = ICONOS[i % ICONOS.length]
          return (
            <li
              key={s.titulo}
              className="flex items-center gap-x-3 rounded-large bg-white p-4 ring-1 ring-grey-20"
            >
              <span
                className={`flex items-center justify-center shrink-0 w-11 h-11 rounded-circle text-white [&_svg]:w-5 [&_svg]:h-5 ${
                  COLORES[i % COLORES.length]
                }`}
              >
                <Icono />
              </span>
              <span className="flex flex-col">
                <span className="txt-compact-small-plus text-denver-900">
                  {s.titulo}
                </span>
                <span className="txt-compact-xsmall text-grey-50">
                  {s.detalle}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Servicios
