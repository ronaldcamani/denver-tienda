import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PASOS = [
  "Crea tu cuenta con tu RUC",
  "Te aprobamos como mayorista",
  "Ves tus precios al iniciar sesión",
]

const BandaMayorista = () => {
  return (
    <section className="content-container py-12">
      <div className="rounded-large bg-denver-900 text-white p-8 small:p-12 grid grid-cols-1 small:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-lapiz-300">
            Venta mayorista
          </span>
          <h2 className="text-2xl small:text-3xl font-extrabold">
            ¿Tienes una librería, bodega o colegio?
          </h2>
          <p className="text-denver-100 max-w-md">
            Accede a precios especiales por mayor en todo el catálogo y compra
            con factura.
          </p>
          <LocalizedClientLink
            href="/account"
            className="w-fit rounded-circle bg-lapiz-400 px-6 py-3 txt-compact-medium-plus text-denver-900 hover:bg-lapiz-300 transition-colors"
          >
            Quiero ser mayorista
          </LocalizedClientLink>
        </div>
        <ol className="flex flex-col gap-y-3">
          {PASOS.map((paso, i) => (
            <li
              key={paso}
              className="flex items-center gap-x-4 rounded-large bg-white/5 px-5 py-4"
            >
              <span className="flex items-center justify-center shrink-0 w-9 h-9 rounded-circle bg-lapiz-400 text-denver-900 font-bold">
                {i + 1}
              </span>
              <span className="txt-medium">{paso}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default BandaMayorista
