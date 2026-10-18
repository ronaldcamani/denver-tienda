import { PaginaLegal } from "@lib/legal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PaginaLegalTemplate = ({ pagina }: { pagina: PaginaLegal }) => (
  <div className="content-container py-12">
    <article className="max-w-2xl flex flex-col gap-y-4 text-base-regular text-ui-fg-base">
      <h1 className="text-3xl-semi mb-2">{pagina.titulo}</h1>
      {pagina.parrafos.map((parrafo, i) =>
        Array.isArray(parrafo) ? (
          <ul key={i} className="list-disc pl-6 flex flex-col gap-y-1">
            {parrafo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {parrafo.negrita && (
              <span className="font-semibold">{parrafo.negrita} </span>
            )}
            {parrafo.texto}
          </p>
        )
      )}
      <p className="txt-small text-ui-fg-subtle mt-6">
        ¿Tienes un reclamo? Regístralo en nuestro{" "}
        <LocalizedClientLink
          href="/libro-de-reclamaciones"
          className="text-ui-fg-interactive hover:underline"
        >
          Libro de Reclamaciones
        </LocalizedClientLink>
        .
      </p>
    </article>
  </div>
)

export default PaginaLegalTemplate
