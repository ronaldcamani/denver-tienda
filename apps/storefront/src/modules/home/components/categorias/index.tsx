import {
  AcademicCap,
  Calendar,
  DocumentText,
  Gift,
  Puzzle,
  Sparkles,
  Palette,
  ShoppingBag,
  Tag,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { esCategoriaDeCampana } from "@lib/campana"

const ICONOS: Record<string, typeof Tag> = {
  Navidad: Sparkles,
  Juguetes: Puzzle,
  Regalos: Gift,
  Escolar: AcademicCap,
  Oficina: Calendar,
  Papelería: DocumentText,
  "Arte y Diseño": Palette,
  "Mochilas y Cartucheras": ShoppingBag,
}

const COLORES = [
  "bg-denver-100 text-denver-700",
  "bg-lapiz-100 text-lapiz-500",
  "bg-navidad-100 text-navidad-600",
  "bg-grey-10 text-grey-70",
]

const Categorias = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const principales = categories.filter(
    (c) => !c.parent_category && esCategoriaDeCampana(c.handle)
  )

  if (!principales.length) {
    return null
  }

  return (
    <section className="content-container py-8">
      <h2 className="text-xl font-bold text-denver-900 mb-4">
        Compra por categoría
      </h2>
      <ul className="grid grid-cols-2 xsmall:grid-cols-3 gap-3">
        {principales.map((c, i) => {
          const Icono = ICONOS[c.name] ?? Tag
          return (
            <li key={c.id}>
              <LocalizedClientLink
                href={`/categories/${c.handle}`}
                className="group flex flex-col items-center gap-y-3 rounded-large bg-white p-5 ring-1 ring-grey-20 hover:ring-denver-500 transition-shadow"
              >
                <span
                  className={`flex items-center justify-center w-14 h-14 rounded-circle [&_svg]:w-6 [&_svg]:h-6 ${
                    COLORES[i % COLORES.length]
                  }`}
                >
                  <Icono />
                </span>
                <span className="txt-compact-small-plus text-center text-grey-80 group-hover:text-denver-600">
                  {c.name}
                </span>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Categorias
