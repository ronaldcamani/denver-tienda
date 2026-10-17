import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type Filtro = { collection_id: string[] } | { category_id: string[] }

export default async function ProductRail({
  title,
  href,
  filtro,
  region,
}: {
  title: string
  href: string
  filtro: Filtro
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      ...filtro,
      limit: 8,
      fields: "*variants.calculated_price",
    } as HttpTypes.StoreProductListParams,
  })

  if (!pricedProducts?.length) {
    return null
  }

  return (
    <div className="content-container py-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-bold text-denver-900">{title}</h2>
        <InteractiveLink href={href}>Ver todo</InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-3 small:gap-4">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
