// Genera el CSV de productos para el importador de WooCommerce a partir del
// reporte de productos del sistema de ventas. La limpieza y las reglas de
// categorias (carpeta catalogo) son una copia de las de Medusa, para que esta
// tienda no dependa de apps/backend.
//
// Uso: npm run csv -- "ruta/Reporte - productos 5.xlsx"

import fs from "node:fs"
import path from "node:path"
import ExcelJS from "exceljs"
import { CATEGORIAS_CAMPANA } from "./catalogo/categorias"
import {
  FilaReporte,
  ProductoLimpio,
  limpiarCatalogo,
} from "./catalogo/limpieza"

const COLUMNAS = {
  nombre: "NOMBRE",
  precio: "PRECIO",
  unidadMedida: "UN. MEDIDA",
  stock: "STOCK",
  afectacionIgv: "CAT. PRODUCTO",
} as const

// Encabezados del importador nativo de WooCommerce (Productos > Importar), que
// los reconoce sin mapeo manual.
const ENCABEZADOS = [
  "Type",
  "SKU",
  "Name",
  "Published",
  "Visibility in catalog",
  "Tax status",
  "In stock?",
  "Stock",
  "Backorders allowed?",
  "Regular price",
  "Categories",
  "Meta: unidad_medida",
  "Meta: sunat_afectacion_igv",
]

// Catalogo 07 de SUNAT: 10 gravado, 20 exonerado.
const CODIGO_AFECTACION = { gravado: "10", exonerado: "20" } as const

async function leerReporte(ruta: string): Promise<FilaReporte[]> {
  const libro = new ExcelJS.Workbook()
  await libro.xlsx.readFile(ruta)
  const hoja = libro.worksheets[0]
  if (!hoja) throw new Error("El Excel no tiene hojas")

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
    throw new Error(`Faltan columnas en el Excel: ${faltan.join(", ")}`)
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

const esDeCampana = (p: ProductoLimpio) =>
  CATEGORIAS_CAMPANA.includes(p.categoria)

// Igual que en Medusa: se publica lo de campana que se puede vender. Sin
// control de stock se vende sin limite hasta que se cuente.
const sePublica = (p: ProductoLimpio) =>
  esDeCampana(p) && (p.stock > 0 || !p.controlarStock)

function celda(valor: string | number) {
  const texto = String(valor)
  return /[",\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

function filaCsv(p: ProductoLimpio) {
  const sinStock = p.controlarStock && p.stock <= 0
  return [
    "simple",
    p.sku,
    p.title,
    sePublica(p) ? 1 : -1,
    "visible",
    p.afectacionIgv === "exonerado" ? "none" : "taxable",
    sinStock ? 0 : 1,
    p.controlarStock ? p.stock : "",
    0,
    p.precio.toFixed(2),
    p.categoria,
    p.unidadMedida,
    CODIGO_AFECTACION[p.afectacionIgv],
  ]
    .map(celda)
    .join(",")
}

// Plantilla para que la tienda llene sus precios por volumen, en el formato
// cantidad:precio que importa el plugin Tiered Pricing Table.
function filaPlantillaMayorista(p: ProductoLimpio) {
  return [p.sku, p.title, p.categoria, p.precio.toFixed(2), ""]
    .map(celda)
    .join(",")
}

async function main() {
  const ruta = process.argv[2]
  if (!ruta) {
    console.error('Uso: npm run csv -- "ruta/Reporte - productos.xlsx"')
    process.exit(1)
  }

  const { productos, descartados, duplicados } = limpiarCatalogo(
    await leerReporte(ruta),
  )
  const salida = path.join(__dirname, "..", "datos")
  fs.mkdirSync(salida, { recursive: true })

  // BOM para que Excel abra bien las tildes si alguien revisa el archivo.
  const bom = "﻿"
  fs.writeFileSync(
    path.join(salida, "productos-woocommerce.csv"),
    bom + [ENCABEZADOS.join(","), ...productos.map(filaCsv)].join("\n") + "\n",
  )
  fs.writeFileSync(
    path.join(salida, "precios-mayoristas.csv"),
    bom +
      [
        [
          "SKU",
          "Nombre",
          "Categoria",
          "Precio unidad",
          "Precios por volumen (ej. 12:2.50,100:2.20)",
        ]
          .map(celda)
          .join(","),
        ...productos.filter(sePublica).map(filaPlantillaMayorista),
      ].join("\n") +
      "\n",
  )

  const porCategoria = new Map<string, { total: number; publicados: number }>()
  for (const p of productos) {
    const c = porCategoria.get(p.categoria) ?? { total: 0, publicados: 0 }
    c.total++
    if (sePublica(p)) c.publicados++
    porCategoria.set(p.categoria, c)
  }

  console.log(`Productos: ${productos.length}`)
  console.log(`Publicados: ${productos.filter(sePublica).length}`)
  console.log(`Duplicados juntados: ${duplicados}`)
  console.log(`Descartados: ${descartados.length}`)
  for (const d of descartados) {
    console.log(`  fila ${d.filaExcel}: ${d.nombre.trim()} (${d.motivo})`)
  }
  for (const [categoria, c] of [...porCategoria].sort(
    (a, b) => b[1].total - a[1].total,
  )) {
    console.log(`  ${categoria}: ${c.total} (${c.publicados} publicados)`)
  }
  console.log(`Archivos en ${salida}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
