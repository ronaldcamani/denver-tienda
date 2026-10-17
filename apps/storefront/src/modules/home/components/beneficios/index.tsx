import { DocumentText, ReceiptPercent, TruckFast, Users } from "@medusajs/icons"

const BENEFICIOS = [
  {
    icono: ReceiptPercent,
    titulo: "Por mayor y menor",
    texto: "Cotiza volúmenes por WhatsApp",
  },
  {
    icono: TruckFast,
    titulo: "Envíos a todo el Perú",
    texto: "Delivery local o por agencia",
  },
  {
    icono: DocumentText,
    titulo: "Boleta o factura",
    texto: "Ingresa tu RUC al pagar",
  },
  {
    icono: Users,
    titulo: "Cuenta mayorista",
    texto: "Para negocios y colegios",
  },
]

const Beneficios = () => {
  return (
    <section className="content-container py-6">
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-3">
        {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
          <li
            key={titulo}
            className="flex items-center gap-x-3 rounded-large bg-denver-50 px-4 py-3"
          >
            <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-circle bg-white text-denver-600 [&_svg]:w-5 [&_svg]:h-5">
              <Icono />
            </span>
            <span className="flex flex-col">
              <span className="txt-compact-small-plus text-denver-900">
                {titulo}
              </span>
              <span className="txt-compact-xsmall text-grey-50">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Beneficios
