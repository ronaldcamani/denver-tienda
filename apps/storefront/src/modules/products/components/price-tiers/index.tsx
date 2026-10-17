import { listPriceTiers, PriceTier } from "@lib/data/price-tiers"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PriceTiersProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const rangeLabel = (tier: PriceTier, next?: PriceTier) => {
  const max = tier.max_quantity ?? (next ? next.min_quantity - 1 : null)
  if (max === null) {
    return `${tier.min_quantity} a más`
  }
  return `${tier.min_quantity} a ${max}`
}

export default async function PriceTiers({ product, region }: PriceTiersProps) {
  const variants = await listPriceTiers(product.id!, region.currency_code)
  // Variants of one product share the same tiers; show the first one.
  const tiers = variants.find((v) => v.tiers.length > 1)?.tiers

  if (!tiers) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3" data-testid="price-tiers">
      <h3 className="text-base-semi">Precio por volumen</h3>
      <table className="w-full text-small-regular">
        <thead>
          <tr className="text-ui-fg-subtle border-b border-ui-border-base">
            <th className="text-left font-normal py-2">Unidades</th>
            <th className="text-right font-normal py-2">Precio c/u</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => (
            <tr
              key={tier.min_quantity}
              className="border-b border-ui-border-base last:border-b-0"
            >
              <td className="py-2">{rangeLabel(tier, tiers[i + 1])}</td>
              <td className="py-2 text-right text-ui-fg-base font-medium">
                {convertToLocale({
                  amount: tier.amount,
                  currency_code: region.currency_code,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-small-regular text-ui-fg-subtle">
        El precio baja solo según la cantidad en tu carrito. ¿Compras para tu
        negocio?{" "}
        <LocalizedClientLink href="/account" className="underline">
          Crea tu cuenta mayorista
        </LocalizedClientLink>
        .
      </p>
    </div>
  )
}
