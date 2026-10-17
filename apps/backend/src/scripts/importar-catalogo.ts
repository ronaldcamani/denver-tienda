/**
 * Carga el catalogo real de DENVER desde el reporte de productos en Excel
 * (columnas NOMBRE, PRECIO, PRECIO SIN IGV, UN. MEDIDA, STOCK, CAT. PRODUCTO).
 *
 *   npx medusa exec ./src/scripts/importar-catalogo.ts ruta/al/reporte.xlsx
 *   npx medusa exec ./src/scripts/importar-catalogo.ts ruta/al/reporte.xlsx simular
 *   npx medusa exec ./src/scripts/importar-catalogo.ts ruta/al/reporte.xlsx quitar-demo
 *
 * simular solo muestra lo que haria, sin escribir nada.
 * quitar-demo borra los 8 productos de prueba del catalogo demo.
 *
 * Todo el Excel se carga, pero solo se publican los productos de las
 * categorias de la campaña activa (CATEGORIAS_CAMPANA) que se pueden vender;
 * el resto queda en borrador. Los productos de campaña entran a la coleccion
 * Navidad. Volver a correrlo no duplica nada: a los productos que ya existen
 * solo se les actualiza la categoria y si se publican u ocultan.
 */
import ExcelJS from "exceljs"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createCollectionsWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

import { PRODUCTOS as PRODUCTOS_DEMO } from "../migration-scripts/data/catalogo-demo"
import { CATEGORIAS_CAMPANA } from "./catalogo/categorias"
import {
  FilaReporte,
  ProductoLimpio,
  limpiarCatalogo,
} from "./catalogo/limpieza"

const TAMANO_LOTE = 100
const TAMANO_INDEXADO = 50
const COLECCION_CAMPANA = { title: "Navidad 2026", handle: "navidad" }

const esDeCampana = (p: ProductoLimpio) =>
  CATEGORIAS_CAMPANA.includes(p.categoria)
// Un producto de campaña con stock contado en 0 no se puede comprar, asi que no se muestra.
const sePublica = (p: ProductoLimpio) =>
  esDeCampana(p) && (p.stock > 0 || !p.controlarStock)
const COLUMNAS = {
  nombre: "NOMBRE",
  precio: "PRECIO",
  unidadMedida: "UN. MEDIDA",
  stock: "STOCK",
  afectacionIgv: "CAT. PRODUCTO",
} as const

async function leerReporte(ruta: string): Promise<FilaReporte[]> {
  const libro = new ExcelJS.Workbook()
  await libro.xlsx.readFile(ruta)
  const hoja = libro.worksheets[0]
  if (!hoja) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "El Excel no tiene hojas",
    )
  }

  const encabezados = new Map<string, number>()
  hoja.getRow(1).eachCell((celda, col) => {
    encabezados.set(
      String(celda.value ?? "")
        .trim()
        .toUpperCase(),
      col,
    )
  })
  const faltan = Object.values(COLUMNAS).filter((c) => !encabezados.has(c))
  if (faltan.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Faltan columnas en el Excel: ${faltan.join(", ")}`,
    )
  }

  const valor = (fila: ExcelJS.Row, columna: string) => {
    const v = fila.getCell(encabezados.get(columna)!).value
    return v && typeof v === "object" && "result" in v ? v.result : v
  }

  const filas: FilaReporte[] = []
  for (let r = 2; r <= hoja.rowCount; r++) {
    const fila = hoja.getRow(r)
    filas.push({
      nombre: valor(fila, COLUMNAS.nombre),
      precio: valor(fila, COLUMNAS.precio),
      unidadMedida: valor(fila, COLUMNAS.unidadMedida),
      stock: valor(fila, COLUMNAS.stock),
      afectacionIgv: valor(fila, COLUMNAS.afectacionIgv),
    })
  }
  return filas
}

export default async function importarCatalogo({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const ruta = args.find((a) => a !== "simular" && a !== "quitar-demo")
  const simular = args.includes("simular")
  const quitarDemo = args.includes("quitar-demo")
  if (!ruta) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Indica la ruta del Excel: npx medusa exec ./src/scripts/importar-catalogo.ts reporte.xlsx",
    )
  }

  const { productos, descartados, duplicados } = limpiarCatalogo(
    await leerReporte(ruta),
  )

  const porCategoria = new Map<string, number>()
  productos.forEach((p) =>
    porCategoria.set(p.categoria, (porCategoria.get(p.categoria) ?? 0) + 1),
  )
  const publicados = productos.filter(sePublica).length

  logger.info(
    `Productos válidos: ${productos.length} (${publicados} se publican, ${productos.length - publicados} quedan en borrador)`,
  )
  logger.info(
    `Sin control de stock: ${productos.filter((p) => !p.controlarStock).length}`,
  )
  logger.info(
    `Repetidos unidos: ${duplicados}. Descartados: ${descartados.length}`,
  )
  descartados.forEach((d) =>
    logger.info(`  Fila ${d.filaExcel} descartada, ${d.motivo}: ${d.nombre}`),
  )
  ;[...porCategoria.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => logger.info(`  ${c}: ${n}`))

  if (simular) {
    logger.info("Simulación terminada, no se escribió nada.")
    return
  }

  // ---- Datos base de la tienda ---------------------------------------------

  const [{ data: canales }, { data: perfiles }, { data: almacenes }] =
    await Promise.all([
      query.graph({ entity: "sales_channel", fields: ["id"] }),
      query.graph({ entity: "shipping_profile", fields: ["id"] }),
      query.graph({ entity: "stock_location", fields: ["id"] }),
    ])
  if (!canales[0] || !perfiles[0] || !almacenes[0]) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Falta el canal de venta, el perfil de envío o el almacén. Corre primero npx medusa db:migrate.",
    )
  }

  if (quitarDemo) {
    const handlesDemo = PRODUCTOS_DEMO.map((p) => p.handle)
    const { data: demo } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { handle: handlesDemo },
    })
    if (demo.length) {
      await deleteProductsWorkflow(container).run({
        input: { ids: demo.map((p) => p.id) },
      })
      logger.info(`Borrados ${demo.length} productos de prueba`)
    }
  }

  const { data: categoriasExistentes } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const faltantes = [...porCategoria.keys()].filter(
    (c) => !categoriasExistentes.some((e) => e.name === c),
  )
  if (faltantes.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: faltantes.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    logger.info(`Categorías creadas: ${faltantes.join(", ")}`)
  }
  const { data: categorias } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const idCategoria = new Map(categorias.map((c) => [c.name, c.id]))

  const { data: opciones } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
    filters: { title: "Presentación" },
  })
  let idOpcion = opciones[0]?.id
  if (!idOpcion) {
    const { result } = await createProductOptionsWorkflow(container).run({
      input: {
        product_options: [{ title: "Presentación", values: ["Única"] }],
      },
    })
    idOpcion = result[0].id
  }

  const { data: colecciones } = await query.graph({
    entity: "product_collection",
    fields: ["id"],
    filters: { handle: COLECCION_CAMPANA.handle },
  })
  let idColeccion = colecciones[0]?.id
  if (!idColeccion) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [COLECCION_CAMPANA] },
    })
    idColeccion = result[0].id
  }

  // ---- Crear productos -------------------------------------------------------

  const { data: existentes } = await query.graph({
    entity: "product",
    fields: ["handle"],
  })
  const tomados = new Set(existentes.map((p) => p.handle))
  const nuevos = productos.filter((p) => !tomados.has(p.handle))
  logger.info(
    `Ya existían ${productos.length - nuevos.length}. Se crearán ${nuevos.length}.`,
  )

  let creados = 0
  for (let inicio = 0; inicio < nuevos.length; inicio += TAMANO_LOTE) {
    const lote = nuevos.slice(inicio, inicio + TAMANO_LOTE)
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: lote.map((p) => ({
          title: p.title,
          handle: p.handle,
          status: sePublica(p) ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
          collection_id: esDeCampana(p) ? idColeccion : undefined,
          shipping_profile_id: perfiles[0].id,
          category_ids: [idCategoria.get(p.categoria)!],
          sales_channels: [{ id: canales[0].id }],
          options: [{ id: idOpcion }],
          metadata: {
            unidad_medida: p.unidadMedida,
            afectacion_igv: p.afectacionIgv,
            fila_excel: p.filaExcel,
            stock_reporte: p.controlarStock ? p.stock : null,
          },
          variants: [
            {
              title: "Única",
              sku: p.sku,
              options: { Presentación: "Única" },
              manage_inventory: p.controlarStock,
              prices: [{ currency_code: "pen", amount: p.precio }],
            },
          ],
        })),
      },
    })

    const { data: variantes } = await query.graph({
      entity: "product_variant",
      fields: ["sku", "inventory_items.inventory_item_id"],
      filters: { product_id: result.map((p) => p.id) },
    })
    const stockPorSku = new Map(lote.map((p) => [p.sku, p.stock]))
    // Los que no controlan stock tambien llevan nivel en el almacen para que
    // el panel los muestre en el inventario.
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: variantes.flatMap((v) =>
          (v.inventory_items ?? []).map((i) => ({
            inventory_item_id: i!.inventory_item_id,
            location_id: almacenes[0].id,
            stocked_quantity: stockPorSku.get(v.sku!) ?? 0,
          })),
        ),
      },
    })

    creados += lote.length
    logger.info(`Creados ${creados}/${nuevos.length}`)
  }

  // ---- Publicar u ocultar los que ya existian ----------------------------------

  const previos = productos.filter((p) => tomados.has(p.handle))
  const { data: estadoActual } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "status", "collection_id", "categories.id"],
    filters: { handle: previos.map((p) => p.handle) },
  })
  const porHandle = new Map(previos.map((p) => [p.handle, p]))
  const cambios = estadoActual
    .map((actual) => {
      const p = porHandle.get(actual.handle)!
      const status = sePublica(p)
        ? ProductStatus.PUBLISHED
        : ProductStatus.DRAFT
      const collection_id = esDeCampana(p) ? idColeccion : actual.collection_id
      const idCat = idCategoria.get(p.categoria)!
      const categoriaIgual =
        actual.categories?.length === 1 && actual.categories[0]?.id === idCat
      return actual.status === status &&
        actual.collection_id === collection_id &&
        categoriaIgual
        ? null
        : { id: actual.id, status, collection_id, category_ids: [idCat] }
    })
    .filter((c) => c !== null)
  for (const { id, ...update } of cambios) {
    await updateProductsWorkflow(container).run({
      input: { selector: { id }, update },
    })
  }
  if (cambios.length)
    logger.info(`Actualizados ${cambios.length} productos que ya existían`)

  // ---- Buscador ----------------------------------------------------------------

  // El indexado por eventos es asincrono y este proceso puede terminar antes,
  // asi que se reindexa todo aqui; tambien corrige los precios en soles.
  const search = container.resolve(Modules.SEARCH)
  const { data: todos } = await query.graph({
    entity: "product",
    fields: ["id"],
  })
  for (let inicio = 0; inicio < todos.length; inicio += TAMANO_INDEXADO) {
    await search.ingest({
      name: "product.created",
      data: todos
        .slice(inicio, inicio + TAMANO_INDEXADO)
        .map((p) => ({ id: p.id })),
    } as never)
  }
  logger.info(`Buscador actualizado con ${todos.length} productos. Listo.`)
}
