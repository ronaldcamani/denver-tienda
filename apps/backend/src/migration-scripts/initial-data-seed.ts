import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  PriceListStatus,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createCustomerGroupsWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  CATEGORIAS,
  COLECCIONES,
  PRODUCTOS,
  preciosPorEscala,
} from "./data/catalogo-demo"

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Seeding store data...")
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Tienda online DENVER",
          description: "Venta por la web, minorista y mayorista",
        },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Storefront DENVER",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  // Precios con IGV incluido, como se muestran al cliente en Peru.
  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Importadora y Multiservicios DENVER",
          supported_currencies: [
            { currency_code: "pen", is_default: true, is_tax_inclusive: true },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  })

  logger.info("Seeding region data...")
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Perú",
          currency_code: "pen",
          countries: ["pe"],
          is_tax_inclusive: true,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regionResult[0]

  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "pe",
        provider_id: "tp_system",
        default_tax_rate: { rate: 18, code: "IGV", name: "IGV" },
      },
    ],
  })
  logger.info("Finished seeding regions and taxes.")

  logger.info("Seeding stock location data...")
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Almacén principal",
          address: {
            city: "Arequipa",
            country_code: "PE",
            address_1: "",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  logger.info("Seeding fulfillment data...")
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Envíos DENVER",
    type: "shipping",
    service_zones: [
      {
        name: "Perú",
        geo_zones: [{ country_code: "pe", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  const opcionesEnvio = [
    {
      name: "Delivery en la ciudad",
      code: "delivery-local",
      description: "Entrega a domicilio en 24 a 48 horas.",
      amount: 10,
    },
    {
      name: "Envío a provincias por agencia",
      code: "agencia-provincias",
      description: "Despacho por Olva o Shalom, pago del flete incluido.",
      amount: 20,
    },
    {
      name: "Recojo en tienda",
      code: "recojo-tienda",
      description: "Recoge tu pedido en nuestro local sin costo.",
      amount: 0,
    },
  ]

  await createShippingOptionsWorkflow(container).run({
    input: opcionesEnvio.map((o) => ({
      name: o.name,
      price_type: "flat" as const,
      provider_id: "manual_manual",
      service_zone_id: fulfillmentSet.service_zones[0].id,
      shipping_profile_id: shippingProfile.id,
      type: { label: o.name, description: o.description, code: o.code },
      prices: [
        { currency_code: "pen", amount: o.amount },
        { region_id: region.id, amount: o.amount },
      ],
      rules: [
        { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
        { attribute: "is_return", value: "false", operator: "eq" as const },
      ],
    })),
  })
  logger.info("Finished seeding fulfillment data.")

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  })
  logger.info("Finished seeding stock location data.")

  logger.info("Seeding customer groups...")
  const {
    result: [grupoMayorista],
  } = await createCustomerGroupsWorkflow(container).run({
    input: {
      customersData: [{ name: "Mayorista" }],
    },
  })

  logger.info("Seeding product data...")
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: CATEGORIAS.map((name) => ({ name, is_active: true })),
    },
  })

  const { result: collectionResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: COLECCIONES.map((c) => ({ title: c.title, handle: c.handle })),
    },
  })

  const colores = [...new Set(PRODUCTOS.flatMap((p) => p.colores ?? []))]
  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        { title: "Color", values: colores },
        { title: "Presentación", values: ["Única"] },
      ],
    },
  })
  const colorOption = productOptionsResult.find((o) => o.title === "Color")!
  const presentacionOption = productOptionsResult.find(
    (o) => o.title === "Presentación"
  )!

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTOS.map((p) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        weight: p.weight,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        category_ids: [categoryResult.find((c) => c.name === p.categoria)!.id],
        // A product belongs to one collection; the first is its main campaign.
        collection_id: p.colecciones.length
          ? collectionResult.find((c) => c.handle === p.colecciones[0])!.id
          : undefined,
        options: [{ id: p.colores ? colorOption.id : presentacionOption.id }],
        variants: p.colores
          ? p.colores.map((color) => ({
              title: color,
              sku: `${p.sku}-${color.toUpperCase()}`,
              options: { Color: color },
              prices: preciosPorEscala(p.precios),
            }))
          : [
              {
                title: "Única",
                sku: p.sku,
                options: { Presentación: "Única" },
                prices: preciosPorEscala(p.precios),
              },
            ],
        sales_channels: [{ id: defaultSalesChannel.id }],
      })),
    },
  })
  logger.info("Finished seeding product data.")

  logger.info("Seeding wholesale price list...")
  await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "Precios mayoristas",
          description: "Precio para clientes aprobados del grupo Mayorista",
          status: PriceListStatus.ACTIVE,
          rules: { "customer.groups.id": [grupoMayorista.id] },
          prices: productResult.flatMap((product) => {
            const datos = PRODUCTOS.find((p) => p.handle === product.handle)!
            return (product.variants ?? []).map((v) => ({
              variant_id: v.id,
              currency_code: "pen",
              amount: datos.precios.mayorista,
            }))
          }),
        },
      ],
    },
  })
  logger.info("Finished seeding wholesale price list.")

  logger.info("Seeding inventory levels.")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 500,
        inventory_item_id: item.id,
      })),
    },
  })
  logger.info("Finished seeding inventory levels data.")
}
