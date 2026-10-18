import { paginaLegal } from "@lib/legal"
import PaginaLegalTemplate from "@modules/legal/templates/pagina-legal"
import { Metadata } from "next"

const pagina = paginaLegal("privacidad")!

export const metadata: Metadata = {
  title: pagina.titulo,
  description: pagina.descripcion,
}

export default function Page() {
  return <PaginaLegalTemplate pagina={pagina} />
}
