import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, HttpTypes } from "@medusajs/framework/types"

// Muestra en el pedido el comprobante que pidio el cliente, para emitirlo en
// SUNAT SOL. Usa las clases de @medusajs/ui en HTML simple porque sus
// componentes chocan con los tipos de React del storefront en este monorepo.
const ComprobantePedido = ({ data }: DetailWidgetProps<HttpTypes.AdminOrder>) => {
  const metadata = (data.metadata ?? {}) as Record<string, string | undefined>
  if (!metadata.comprobante) {
    return null
  }
  const esFactura = metadata.comprobante === "factura"

  return (
    <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y">
      <div className="px-6 py-4">
        <h2 className="font-sans font-medium h2-core text-ui-fg-base">Comprobante</h2>
      </div>
      <div className="flex flex-col gap-y-1 px-6 py-4 txt-small text-ui-fg-subtle">
        <p className="txt-small-plus text-ui-fg-base">{esFactura ? "Factura" : "Boleta"}</p>
        <p>
          {esFactura ? "RUC" : "DNI o CE"}: {metadata.documento}
        </p>
        {esFactura && <p>Razón social: {metadata.razon_social}</p>}
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default ComprobantePedido
