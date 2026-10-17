// Campaña activa de la tienda. Durante Navidad solo se muestran estas
// categorias y esta coleccion; el resto del catalogo esta en borrador en el
// backend (ver apps/backend/src/scripts/catalogo/categorias.ts).
export const CAMPANA = {
  titulo: "Navidad 2026",
  coleccion: "navidad",
  categorias: ["navidad", "juguetes", "regalos"],
}

export const esCategoriaDeCampana = (handle?: string | null) =>
  !!handle && CAMPANA.categorias.includes(handle)
