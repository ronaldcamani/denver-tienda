import FormularioReclamo from "@modules/legal/components/formulario-reclamo"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description:
    "Registra tu reclamo o queja conforme al Código de Protección y Defensa del Consumidor.",
}

export default function LibroDeReclamaciones() {
  return (
    <div className="content-container py-12">
      <div className="max-w-2xl flex flex-col gap-y-6">
        <div>
          <h1 className="text-3xl-semi mb-2">Libro de Reclamaciones</h1>
          <p className="text-base-regular text-ui-fg-subtle">
            Conforme al Código de Protección y Defensa del Consumidor (Ley
            29571), puedes registrar aquí tu reclamo o queja. Te enviamos una
            copia a tu correo y te respondemos en un máximo de 15 días hábiles.
          </p>
        </div>
        <FormularioReclamo />
      </div>
    </div>
  )
}
