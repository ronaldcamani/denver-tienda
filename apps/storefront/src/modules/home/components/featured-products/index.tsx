import { HttpTypes } from "@medusajs/types"
import { CAMPANA, esCategoriaDeCampana } from "@lib/campana"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  categories,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
}) {
  const coleccion = collections.find((c) => c.handle === CAMPANA.coleccion)
  // Una fila por categoria de la campaña, en el orden definido en CAMPANA.
  const categorias = CAMPANA.categorias
    .map((handle) => categories.find((c) => c.handle === handle))
    .filter((c) => c && esCategoriaDeCampana(c.handle))

  return (
    <>
      {coleccion && (
        <li>
          <ProductRail
            title={`Destacados de ${coleccion.title}`}
            href={`/collections/${coleccion.handle}`}
            filtro={{ collection_id: [coleccion.id] }}
            region={region}
          />
        </li>
      )}
      {categorias.map((c) => (
        <li key={c!.id}>
          <ProductRail
            title={c!.name}
            href={`/categories/${c!.handle}`}
            filtro={{ category_id: [c!.id] }}
            region={region}
          />
        </li>
      ))}
    </>
  )
}
