"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type PriceTier = {
  amount: number
  min_quantity: number
  max_quantity: number | null
}

export type VariantPriceTiers = {
  variant_id: string
  tiers: PriceTier[]
}

export const listPriceTiers = async (
  productId: string,
  currencyCode: string
): Promise<VariantPriceTiers[]> => {
  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ variants: VariantPriceTiers[] }>(`/store/price-tiers`, {
      method: "GET",
      query: { product_id: productId, currency_code: currencyCode },
      next,
      cache: "force-cache",
    })
    .then(({ variants }) => variants)
    .catch(() => [])
}
