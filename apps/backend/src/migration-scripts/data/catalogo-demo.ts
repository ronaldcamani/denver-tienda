// Catalogo de prueba de DENVER. Se reemplaza por el Excel real de productos.
// Precios en soles (PEN), IGV incluido.
//
// Escalas de precio al publico, por cantidad en el carrito:
//   unidad: 1 a 11, docena: 12 a 47, caja: 48 a mas
// mayorista: precio unico para clientes del grupo Mayorista.

export const CATEGORIAS = [
  "Escolar",
  "Oficina",
  "Papelería",
  "Arte y Diseño",
  "Mochilas y Cartucheras",
] as const

export const COLECCIONES = [
  { title: "Campaña Escolar 2027", handle: "campana-escolar" },
  { title: "Navidad 2026", handle: "navidad" },
] as const

export type Categoria = (typeof CATEGORIAS)[number]
export type Coleccion = (typeof COLECCIONES)[number]["handle"]

export type PreciosEscala = {
  unidad: number
  docena: number
  caja: number
  mayorista: number
}

export type ProductoDemo = {
  title: string
  handle: string
  description: string
  categoria: Categoria
  colecciones: Coleccion[]
  // gramos
  weight: number
  precios: PreciosEscala
  // Sin colores: una sola variante con este SKU.
  sku: string
  colores?: string[]
}

export const PRODUCTOS: ProductoDemo[] = [
  {
    title: "Cuaderno A4 cuadriculado 100 hojas",
    handle: "cuaderno-a4-cuadriculado-100",
    description: "Cuaderno tamaño A4, cuadrícula de 5 mm, tapa dura y 100 hojas de 75 g.",
    categoria: "Escolar",
    colecciones: ["campana-escolar"],
    weight: 450,
    sku: "CUA-A4-CUAD-100",
    precios: { unidad: 6.5, docena: 5.8, caja: 5.2, mayorista: 4.8 },
  },
  {
    title: "Lápiz grafito HB caja x 12",
    handle: "lapiz-grafito-hb-x12",
    description: "Caja de 12 lápices de grafito HB con borrador.",
    categoria: "Escolar",
    colecciones: ["campana-escolar"],
    weight: 120,
    sku: "LAP-HB-X12",
    precios: { unidad: 9.9, docena: 8.9, caja: 7.9, mayorista: 7.2 },
  },
  {
    title: "Colores largos x 12",
    handle: "colores-largos-x12",
    description: "Estuche de 12 colores largos de mina suave.",
    categoria: "Arte y Diseño",
    colecciones: ["campana-escolar", "navidad"],
    weight: 150,
    sku: "COL-LAR-X12",
    precios: { unidad: 12.9, docena: 11.5, caja: 10.5, mayorista: 9.5 },
  },
  {
    title: "Plumones gruesos x 12",
    handle: "plumones-gruesos-x12",
    description: "Set de 12 plumones de punta gruesa, tinta lavable.",
    categoria: "Arte y Diseño",
    colecciones: ["campana-escolar", "navidad"],
    weight: 200,
    sku: "PLU-GRU-X12",
    precios: { unidad: 15.9, docena: 14.5, caja: 13.2, mayorista: 12.0 },
  },
  {
    title: "Lapicero azul punta fina",
    handle: "lapicero-azul-punta-fina",
    description: "Lapicero de tinta azul, punta fina de 0.7 mm.",
    categoria: "Oficina",
    colecciones: [],
    weight: 10,
    sku: "LPC-AZU-07",
    precios: { unidad: 1.2, docena: 1.0, caja: 0.85, mayorista: 0.75 },
  },
  {
    title: "Papel bond A4 75 g paquete x 500",
    handle: "papel-bond-a4-75g-x500",
    description: "Paquete de 500 hojas de papel bond A4 de 75 g para impresora.",
    categoria: "Papelería",
    colecciones: [],
    weight: 2500,
    sku: "PAP-A4-75-500",
    precios: { unidad: 24.9, docena: 23.5, caja: 22.0, mayorista: 21.0 },
  },
  {
    title: "Archivador de palanca lomo ancho",
    handle: "archivador-palanca-lomo-ancho",
    description: "Archivador de cartón con palanca metálica, tamaño oficio, lomo de 8 cm.",
    categoria: "Oficina",
    colecciones: [],
    weight: 600,
    sku: "ARC-PAL-ANCHO",
    precios: { unidad: 8.5, docena: 7.6, caja: 6.9, mayorista: 6.3 },
  },
  {
    title: "Mochila escolar con ruedas",
    handle: "mochila-escolar-ruedas",
    description: "Mochila escolar con ruedas, asa retráctil y dos compartimentos.",
    categoria: "Mochilas y Cartucheras",
    colecciones: ["campana-escolar", "navidad"],
    weight: 1800,
    sku: "MOC-RUE",
    colores: ["Azul", "Rosado"],
    precios: { unidad: 69.9, docena: 64.9, caja: 59.9, mayorista: 55.0 },
  },
]

// Convierte las escalas en precios de Medusa por rango de cantidad.
export function preciosPorEscala(p: PreciosEscala) {
  return [
    { currency_code: "pen", amount: p.unidad },
    { currency_code: "pen", amount: p.docena, min_quantity: 12, max_quantity: 47 },
    { currency_code: "pen", amount: p.caja, min_quantity: 48 },
  ]
}
