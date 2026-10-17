import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { WHATSAPP_NUMEROS, WHATSAPP_URL } from "@lib/contacto"
import { Text } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/common/components/logo"

const CUENTA = [
  { label: "Mi cuenta", href: "/account" },
  { label: "Mis pedidos", href: "/account/orders" },
  { label: "Cuenta mayorista", href: "/account" },
  { label: "Carrito", href: "/cart" },
]

const Columna = ({
  titulo,
  links,
  testId,
}: {
  titulo: string
  links: { label: string; href: string }[]
  testId?: string
}) => (
  <div className="flex flex-col gap-y-3">
    <span className="txt-small-plus text-white">{titulo}</span>
    <ul className="grid grid-cols-1 gap-2 txt-small" data-testid={testId}>
      {links.map((l) => (
        <li key={`${l.label}-${l.href}`}>
          <LocalizedClientLink className="hover:text-white" href={l.href}>
            {l.label}
          </LocalizedClientLink>
        </li>
      ))}
    </ul>
  </div>
)

export default async function Footer() {
  const [{ collections }, productCategories] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories().catch(() => []),
  ])

  const categorias = productCategories
    .filter((c) => !c.parent_category)
    .slice(0, 8)
    .map((c) => ({ label: c.name, href: `/categories/${c.handle}` }))

  const campanas = (collections ?? [])
    .slice(0, 6)
    .map((c) => ({ label: c.title, href: `/collections/${c.handle}` }))

  return (
    <footer className="bg-denver-900 text-denver-100 w-full mt-8">
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-2 small:grid-cols-5 gap-10 py-14">
          <div className="col-span-2 flex flex-col gap-y-4">
            <LocalizedClientLink href="/" className="w-fit">
              <Logo />
            </LocalizedClientLink>
            <p className="txt-small max-w-xs">
              Importadora y Multiservicios DENVER. Útiles escolares y de oficina
              al por mayor y menor, con campañas escolares y de Navidad. Copias,
              impresiones, plotter y anillados.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="w-fit txt-small-plus text-lapiz-300 hover:underline"
            >
              WhatsApp {WHATSAPP_NUMEROS.join(" / ")}
            </a>
          </div>
          {categorias.length > 0 && (
            <Columna
              titulo="Categorías"
              links={categorias}
              testId="footer-categories"
            />
          )}
          {campanas.length > 0 && (
            <Columna titulo="Campañas" links={campanas} />
          )}
          <Columna titulo="Tu cuenta" links={CUENTA} />
        </div>
        <div className="flex flex-col xsmall:flex-row gap-2 w-full py-6 border-t border-white/10 justify-between text-denver-200">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Importadora y Multiservicios DENVER.
            Todos los derechos reservados.
          </Text>
          <Text className="txt-compact-small">
            Precios en soles con IGV incluido.
          </Text>
        </div>
      </div>
    </footer>
  )
}
