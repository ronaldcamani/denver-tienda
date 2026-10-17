import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Logo from "@modules/common/components/logo"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-denver-800 text-white border-b-2 border-denver-500">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi flex items-center gap-x-2 uppercase flex-1 basis-0 hover:opacity-80"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block  txt-compact-plus">
              Volver al carrito
            </span>
            <span className="mt-px block small:hidden txt-compact-plus">
              Volver
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            data-testid="store-link"
            aria-label="DENVER, ir al inicio"
          >
            <Logo />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <p className="py-6 w-full text-center txt-compact-small text-ui-fg-muted">
        Compra segura en DENVER. Precios en soles con IGV incluido.
      </p>
    </div>
  )
}
