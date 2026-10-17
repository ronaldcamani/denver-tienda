import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type Price = {
  amount: number
  currency_code: string
  min_quantity: number | null
  max_quantity: number | null
  price_list_id: string | null
}

// Volume price tiers (unit, dozen, box) of a product's variants, so the
// storefront can show the whole price table and not only the current price.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.query.product_id as string | undefined
  const currencyCode = ((req.query.currency_code as string) || "pen").toLowerCase()

  if (!productId) {
    return res.status(400).json({ message: "product_id is required" })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "price_set.prices.amount",
      "price_set.prices.currency_code",
      "price_set.prices.min_quantity",
      "price_set.prices.max_quantity",
      "price_set.prices.price_list_id",
    ],
    filters: { product_id: productId },
  })

  const tiers = variants.map((variant) => ({
    variant_id: variant.id,
    tiers: ((variant.price_set?.prices ?? []) as Price[])
      .filter((p) => p.currency_code === currencyCode && !p.price_list_id)
      .map((p) => ({
        amount: Number(p.amount),
        min_quantity: p.min_quantity === null ? 1 : Number(p.min_quantity),
        max_quantity: p.max_quantity === null ? null : Number(p.max_quantity),
      }))
      .sort((a, b) => a.min_quantity - b.min_quantity),
  }))

  res.json({ variants: tiers })
}
