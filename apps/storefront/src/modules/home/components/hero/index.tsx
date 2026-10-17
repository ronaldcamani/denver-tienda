import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CAMPANA } from "@lib/campana"

// Arbol y regalos dibujados con CSS mientras no haya fotos de campaña.
const Arbol = () => (
  <div
    aria-hidden="true"
    className="absolute right-0 bottom-0 hidden xsmall:block w-[44%] h-full pointer-events-none"
  >
    <div className="absolute right-[22%] bottom-[14%] w-0 h-0 border-x-[90px] border-x-transparent border-b-[120px] border-b-[#1F8A4C]" />
    <div className="absolute right-[24%] bottom-[34%] w-0 h-0 border-x-[74px] border-x-transparent border-b-[100px] border-b-[#25A35A]" />
    <div className="absolute right-[26.5%] bottom-[52%] w-0 h-0 border-x-[56px] border-x-transparent border-b-[80px] border-b-[#2DBE6C]" />
    <div className="absolute right-[30.5%] bottom-[71%] w-6 h-6 bg-lapiz-400 rotate-45 rounded-soft shadow-lg" />
    <div className="absolute right-[30%] bottom-[6%] w-8 h-10 bg-[#7A4A23]" />
    <div className="absolute right-[34%] bottom-[38%] w-3 h-3 rounded-circle bg-lapiz-400" />
    <div className="absolute right-[27%] bottom-[48%] w-3 h-3 rounded-circle bg-white" />
    <div className="absolute right-[38%] bottom-[24%] w-3 h-3 rounded-circle bg-navidad-500 ring-2 ring-white/40" />
    <div className="absolute right-[24%] bottom-[22%] w-3 h-3 rounded-circle bg-denver-400" />
    <div className="absolute right-[4%] bottom-[6%] w-24 h-20 rounded-rounded bg-navidad-500 shadow-xl">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-lapiz-400" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-lapiz-400" />
    </div>
    <div className="absolute right-[46%] bottom-[6%] w-20 h-16 rounded-rounded bg-white shadow-xl">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-navidad-500" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-navidad-500" />
    </div>
  </div>
)

const Hero = () => {
  return (
    <section className="content-container pt-6 small:pt-8">
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        <div className="relative overflow-hidden small:col-span-2 rounded-large bg-gradient-to-br from-navidad-500 via-navidad-600 to-navidad-700 text-white min-h-[340px] small:min-h-[420px]">
          <div className="relative z-10 flex flex-col justify-center h-full gap-y-5 p-8 small:p-12 max-w-[34rem]">
            <span className="w-fit rounded-circle bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lapiz-300">
              Campaña {CAMPANA.titulo}
            </span>
            <h1 className="text-3xl small:text-[2.75rem] small:leading-[1.1] font-extrabold">
              Todo para tu Navidad en un solo lugar
            </h1>
            <p className="text-navidad-100 txt-medium max-w-sm">
              Árboles, adornos, juguetes y regalos para toda la familia, con
              envío a todo el Perú.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocalizedClientLink
                href={`/collections/${CAMPANA.coleccion}`}
                className="rounded-circle bg-lapiz-400 px-6 py-3 txt-compact-medium-plus text-denver-900 hover:bg-lapiz-300 transition-colors"
              >
                Ver todo Navidad
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/juguetes"
                className="rounded-circle px-6 py-3 txt-compact-medium-plus ring-1 ring-white/50 hover:bg-white/10 transition-colors"
              >
                Ver juguetes
              </LocalizedClientLink>
            </div>
          </div>
          <Arbol />
        </div>

        <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-1 gap-4">
          <LocalizedClientLink
            href="/categories/regalos"
            className="group relative overflow-hidden rounded-large bg-denver-700 text-white p-6 flex flex-col justify-end min-h-[200px]"
          >
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-6 w-36 h-36 rounded-large bg-denver-500 rotate-12"
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-lapiz-400" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 bg-lapiz-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-denver-100">
              Regalos
            </span>
            <span className="text-2xl font-bold mt-1">
              Regalos que sí se usan
            </span>
            <span className="txt-compact-small mt-2 group-hover:underline">
              Ver tazas, tomatodos y más
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
              Empresas, bodegas y colegios
            </span>
            <span className="text-2xl font-bold mt-1">
              Regalos por mayor con tu RUC
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
