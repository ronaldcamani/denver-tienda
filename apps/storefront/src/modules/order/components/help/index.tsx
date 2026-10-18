import { Heading } from "@modules/common/components/ui"
import { WHATSAPP_URL } from "@lib/contacto"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">¿Necesitas ayuda?</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Escríbenos por WhatsApp
            </a>
          </li>
          <li>
            <LocalizedClientLink href="/envios-y-devoluciones">
              Cambios y devoluciones
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/libro-de-reclamaciones">
              Libro de Reclamaciones
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
