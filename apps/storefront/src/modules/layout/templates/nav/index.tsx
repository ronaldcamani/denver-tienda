import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { WHATSAPP_URL, WHATSAPP_VISIBLE } from "@lib/contacto"
import { User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/common/components/logo"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  const topCategories = categories.filter((c) => !c.parent_category)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="bg-denver-900 text-denver-100 text-xs">
        <div className="content-container flex items-center justify-center small:justify-between h-8">
          <p className="truncate">
            Precio por volumen desde 12 unidades. Envíos a todo el Perú.
          </p>
          <div className="hidden small:flex items-center gap-x-6">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              WhatsApp {WHATSAPP_VISIBLE}
            </a>
            <LocalizedClientLink
              href="/account"
              className="text-lapiz-300 hover:underline"
            >
              ¿Tienes RUC? Compra al por mayor
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <header className="bg-denver-800 text-white border-b-2 border-denver-500">
        <nav className="content-container flex items-center gap-x-4 small:gap-x-8 h-16 small:h-20">
          <div className="small:hidden h-full">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          <LocalizedClientLink
            href="/"
            className="shrink-0"
            data-testid="nav-store-link"
            aria-label="DENVER, ir al inicio"
          >
            <Logo />
          </LocalizedClientLink>

          <div className="hidden small:block flex-1 max-w-2xl mx-auto">
            <Search variant="bar" />
          </div>

          <div className="flex items-center gap-x-5 h-full ml-auto small:ml-0 txt-compact-small-plus">
            <div className="small:hidden flex items-center">
              <Search />
            </div>
            <LocalizedClientLink
              className="hidden small:flex items-center gap-x-2 hover:opacity-80"
              href="/account"
              data-testid="nav-account-link"
            >
              <User />
              Mi cuenta
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:opacity-80"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      <div className="bg-white border-b border-ui-border-base shadow-sm">
        <ul className="content-container flex items-center gap-x-6 h-11 overflow-x-auto no-scrollbar txt-compact-small-plus text-grey-70 whitespace-nowrap">
          <li>
            <LocalizedClientLink
              href="/collections/campana-escolar"
              className="rounded-circle bg-lapiz-400 px-3 py-1 text-denver-900 hover:bg-lapiz-300"
            >
              Campaña Escolar
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink
              href="/collections/navidad"
              className="rounded-circle bg-navidad-500 px-3 py-1 text-white hover:bg-navidad-600"
            >
              Navidad
            </LocalizedClientLink>
          </li>
          {topCategories.map((c) => (
            <li key={c.id}>
              <LocalizedClientLink
                href={`/categories/${c.handle}`}
                className="hover:text-denver-600"
              >
                {c.name}
              </LocalizedClientLink>
            </li>
          ))}
          <li>
            <LocalizedClientLink
              href="/store"
              className="hover:text-denver-600"
            >
              Ver todo
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}
