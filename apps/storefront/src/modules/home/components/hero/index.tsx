import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Utiles dibujados con CSS mientras no haya fotos de campana.
const Utiles = () => (
  <div
    aria-hidden="true"
    className="absolute right-0 bottom-0 hidden xsmall:block w-[46%] h-full pointer-events-none"
  >
    <div className="absolute right-[18%] bottom-[-8%] w-40 h-52 rounded-large bg-lapiz-400 rotate-[-10deg] shadow-xl">
      <div className="absolute inset-y-0 left-4 w-1 bg-denver-900/20" />
      <div className="absolute top-8 left-9 right-5 h-2 rounded-circle bg-denver-900/15" />
      <div className="absolute top-14 left-9 right-8 h-2 rounded-circle bg-denver-900/15" />
    </div>
    <div className="absolute right-[4%] bottom-[6%] w-36 h-48 rounded-large bg-white rotate-[8deg] shadow-xl">
      <div className="absolute inset-3 rounded-rounded bg-[linear-gradient(#DCE5FF_1px,transparent_1px),linear-gradient(90deg,#DCE5FF_1px,transparent_1px)] bg-[size:12px_12px]" />
    </div>
    <div className="absolute right-[38%] bottom-[30%] w-4 h-44 rounded-t-circle bg-navidad-500 rotate-[28deg] shadow-lg">
      <div className="absolute -bottom-3 left-0 w-4 h-4 bg-lapiz-100 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </div>
    <div className="absolute right-[30%] bottom-[38%] w-4 h-40 rounded-t-circle bg-lapiz-300 rotate-[14deg] shadow-lg">
      <div className="absolute -bottom-3 left-0 w-4 h-4 bg-lapiz-100 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </div>
  </div>
)

const Hero = () => {
  return (
    <section className="content-container pt-6 small:pt-8">
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        <div className="relative overflow-hidden small:col-span-2 rounded-large bg-gradient-to-br from-denver-500 via-denver-700 to-denver-900 text-white min-h-[340px] small:min-h-[420px]">
          <div className="relative z-10 flex flex-col justify-center h-full gap-y-5 p-8 small:p-12 max-w-[34rem]">
            <span className="w-fit rounded-circle bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lapiz-300">
              Campaña Escolar 2027
            </span>
            <h1 className="text-3xl small:text-[2.75rem] small:leading-[1.1] font-extrabold">
              Toda la lista escolar en un solo lugar
            </h1>
            <p className="text-denver-100 txt-medium max-w-sm">
              Cuadernos, colores, mochilas y más. Mientras más llevas, menos
              pagas por unidad.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocalizedClientLink
                href="/collections/campana-escolar"
                className="rounded-circle bg-lapiz-400 px-6 py-3 txt-compact-medium-plus text-denver-900 hover:bg-lapiz-300 transition-colors"
              >
                Ver campaña escolar
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="rounded-circle px-6 py-3 txt-compact-medium-plus ring-1 ring-white/50 hover:bg-white/10 transition-colors"
              >
                Ver todo el catálogo
              </LocalizedClientLink>
            </div>
          </div>
          <Utiles />
        </div>

        <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-1 gap-4">
          <LocalizedClientLink
            href="/collections/navidad"
            className="group relative overflow-hidden rounded-large bg-navidad-500 text-white p-6 flex flex-col justify-end min-h-[200px]"
          >
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-6 w-36 h-36 rounded-large bg-navidad-600 rotate-12"
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-lapiz-400" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 bg-lapiz-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-navidad-100">
              Navidad 2026
            </span>
            <span className="text-2xl font-bold mt-1">
              Regalos que sí se usan
            </span>
            <span className="txt-compact-small mt-2 group-hover:underline">
              Ver ideas de regalo
            </span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/account"
            className="group relative overflow-hidden rounded-large bg-lapiz-400 text-denver-900 p-6 flex flex-col justify-end min-h-[200px]"
          >
            <div
              aria-hidden="true"
              className="absolute top-5 right-5 rounded-rounded bg-denver-900 px-3 py-2 text-lapiz-300 text-sm font-bold"
            >
              x12 x48
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Librerías, bodegas y colegios
            </span>
            <span className="text-2xl font-bold mt-1">
              Compra al por mayor con tu RUC
            </span>
            <span className="txt-compact-small mt-2 group-hover:underline">
              Solicita tu cuenta mayorista
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
