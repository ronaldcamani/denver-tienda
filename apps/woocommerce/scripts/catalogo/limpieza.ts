import { categoriaDe, sinTildes } from "./categorias"

// Fila tal como viene del reporte de productos del sistema de ventas.
export type FilaReporte = {
  nombre: unknown
  precio: unknown
  unidadMedida: unknown
  stock: unknown
  afectacionIgv: unknown
}

export type ProductoLimpio = {
  title: string
  handle: string
  sku: string
  categoria: string
  precio: number
  stock: number
  // El reporte deja el stock vacio o negativo en productos sin control de
  // inventario; esos se venden sin limite hasta que se cuente su stock.
  controlarStock: boolean
  unidadMedida: string
  afectacionIgv: "gravado" | "exonerado"
  filaExcel: number
}

export type Descartado = { filaExcel: number; nombre: string; motivo: string }

// Precios fuera de este rango son marcadores del sistema, no precios reales.
const PRECIO_MINIMO = 0.1
const PRECIO_MAXIMO = 5000

const MINUSCULAS = new Set([
  "de",
  "del",
  "con",
  "y",
  "para",
  "en",
  "la",
  "el",
  "a",
  "por",
  "sin",
  "o",
])
const UNIDADES = new Set([
  "ml",
  "gr",
  "g",
  "kg",
  "mt",
  "mts",
  "cm",
  "mm",
  "lt",
  "und",
  "unid",
  "pzs",
  "pz",
])

export function aNumero(valor: unknown) {
  if (typeof valor === "number") return valor
  if (typeof valor === "string" && valor.trim() !== "") {
    const n = Number(valor.replace(",", "."))
    return Number.isFinite(n) ? n : null
  }
  return null
}

export function limpiarNombre(nombre: string) {
  const palabras = nombre.replace(/\s+/g, " ").trim().toLowerCase().split(" ")
  return palabras
    .map((p, i) => {
      if (/^x\d+$/.test(p) || UNIDADES.has(p)) return p
      if (
        /\d/.test(p) &&
        /^[a-z]{1,2}\d|^\d+[a-z]{1,2}$/.test(p) &&
        !UNIDADES.has(p.replace(/^\d+/, ""))
      ) {
        return p.toUpperCase()
      }
      if (i > 0 && MINUSCULAS.has(p)) return p
      return p.charAt(0).toUpperCase() + p.slice(1)
    })
    .join(" ")
}

export function aHandle(texto: string) {
  return sinTildes(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function limpiarCatalogo(filas: FilaReporte[]) {
  const descartados: Descartado[] = []
  const porNombre = new Map<string, ProductoLimpio>()
  let duplicados = 0

  filas.forEach((fila, i) => {
    const filaExcel = i + 2
    const nombreOriginal =
      typeof fila.nombre === "string" ? fila.nombre : String(fila.nombre ?? "")
    const unidadMedida = String(fila.unidadMedida ?? "").trim()

    if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]{2,}/.test(nombreOriginal)) {
      descartados.push({
        filaExcel,
        nombre: nombreOriginal,
        motivo: "nombre sin texto",
      })
      return
    }
    if (/servicio/i.test(unidadMedida)) {
      descartados.push({
        filaExcel,
        nombre: nombreOriginal,
        motivo: "servicio de tienda",
      })
      return
    }

    const precio = aNumero(fila.precio)
    if (precio === null || precio < PRECIO_MINIMO || precio > PRECIO_MAXIMO) {
      descartados.push({
        filaExcel,
        nombre: nombreOriginal,
        motivo: `precio no válido (${fila.precio})`,
      })
      return
    }

    const title = limpiarNombre(nombreOriginal)
    const stockReporte = aNumero(fila.stock)
    const stock = Math.max(0, Math.floor(stockReporte ?? 0))
    const controlarStock = stockReporte !== null && stockReporte >= 0
    const clave = sinTildes(title)
    const previo = porNombre.get(clave)

    if (previo) {
      // Mismo producto repetido en el reporte: se queda el de mayor stock.
      duplicados++
      if (stock > previo.stock) {
        porNombre.set(clave, {
          ...previo,
          precio,
          stock,
          controlarStock,
          unidadMedida,
          filaExcel,
        })
      }
      return
    }

    porNombre.set(clave, {
      title,
      handle: "",
      sku: "",
      categoria: categoriaDe(title),
      precio: Math.round(precio * 100) / 100,
      stock,
      controlarStock,
      unidadMedida,
      afectacionIgv:
        String(fila.afectacionIgv).trim().toLowerCase() === "exo"
          ? "exonerado"
          : "gravado",
      filaExcel,
    })
  })

  const handles = new Set<string>()
  const productos = [...porNombre.values()].map((p) => {
    const base = aHandle(p.title) || "producto"
    let handle = base
    for (let n = 2; handles.has(handle); n++) handle = `${base}-${n}`
    handles.add(handle)
    return { ...p, handle, sku: `DEN-${String(p.filaExcel).padStart(5, "0")}` }
  })

  return { productos, descartados, duplicados }
}
