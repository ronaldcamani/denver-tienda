import { Metadata } from "next"

import BandaMayorista from "@modules/home/components/banda-mayorista"
import Beneficios from "@modules/home/components/beneficios"
import Categorias from "@modules/home/components/categorias"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Servicios from "@modules/home/components/servicios"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "DENVER | Útiles escolares y de oficina",
  description: "Útiles escolares y de oficina al por mayor y menor.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, categories] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories().catch(() => []),
  ])

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <Beneficios />
      <Categorias categories={categories} />
      <ul className="flex flex-col">
        <FeaturedProducts collections={collections} region={region} />
      </ul>
      <Servicios />
      <BandaMayorista />
    </>
  )
}
