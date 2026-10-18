"use client"

import { EstadoReclamo, registrarReclamo } from "@lib/data/reclamos"
import { EMPRESA } from "@lib/legal"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"

const Seccion = ({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) => (
  <fieldset className="flex flex-col gap-y-4">
    <legend className="txt-medium-plus text-ui-fg-base mb-3">{titulo}</legend>
    {children}
  </fieldset>
)

const Opciones = ({
  nombre,
  opciones,
}: {
  nombre: string
  opciones: { valor: string; titulo: string; detalle?: string }[]
}) => (
  <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
    {opciones.map((o, i) => (
      <label
        key={o.valor}
        className="flex items-start gap-x-3 border rounded-rounded px-4 py-3 cursor-pointer has-[:checked]:border-ui-border-interactive"
      >
        <input
          type="radio"
          name={nombre}
          value={o.valor}
          defaultChecked={i === 0}
          className="mt-1 accent-ui-fg-interactive"
        />
        <span className="flex flex-col">
          <span className="text-base-regular">{o.titulo}</span>
          {o.detalle && (
            <span className="txt-small text-ui-fg-subtle">{o.detalle}</span>
          )}
        </span>
      </label>
    ))}
  </div>
)

const AreaTexto = ({ name, label }: { name: string; label: string }) => (
  <label className="flex flex-col gap-y-1 txt-compact-medium">
    <span className="text-ui-fg-subtle">{label}*</span>
    <textarea
      name={name}
      required
      rows={4}
      className="bg-ui-bg-field border border-ui-border-base rounded-md px-4 py-3 txt-compact-medium focus:outline-none focus:shadow-borders-interactive-with-active"
    />
  </label>
)

const FormularioReclamo = () => {
  const [estado, accion] = useActionState<EstadoReclamo, FormData>(
    registrarReclamo,
    null
  )

  if (estado?.ok) {
    return (
      <div
        className="border border-ui-border-interactive rounded-rounded p-6 flex flex-col gap-y-2"
        data-testid="reclamo-registrado"
      >
        <h2 className="text-xl-semi">
          Registramos tu hoja N.º {String(estado.numero).padStart(6, "0")}
        </h2>
        <p className="text-base-regular">
          Te enviamos una copia a tu correo. Te responderemos en un plazo máximo
          de 15 días hábiles.
        </p>
        <p className="txt-small text-ui-fg-subtle">
          Fecha:{" "}
          {new Date(estado.fecha).toLocaleString("es-PE", {
            timeZone: "America/Lima",
          })}
        </p>
      </div>
    )
  }

  return (
    <form action={accion} className="flex flex-col gap-y-10">
      <div className="txt-small text-ui-fg-subtle border rounded-rounded p-4">
        <p>
          <span className="font-semibold">Proveedor:</span>{" "}
          {EMPRESA.razonSocial} · RUC {EMPRESA.ruc}
        </p>
        <p>{EMPRESA.direccion}</p>
        <p>
          Fecha:{" "}
          {new Date().toLocaleDateString("es-PE", { timeZone: "America/Lima" })}
        </p>
      </div>

      <Seccion titulo="1. Tus datos">
        <Input label="Nombre completo" name="nombre" required />
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
          <label className="flex flex-col gap-y-1 txt-compact-medium">
            <span className="text-ui-fg-subtle">Tipo de documento*</span>
            <select
              name="tipo_documento"
              className="bg-ui-bg-field border border-ui-border-base rounded-md px-4 h-11"
              defaultValue="dni"
            >
              <option value="dni">DNI</option>
              <option value="ce">Carné de extranjería</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="ruc">RUC</option>
            </select>
          </label>
          <Input label="Número de documento" name="documento" required />
        </div>
        <Input label="Domicilio" name="domicilio" required />
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
          <Input label="Teléfono" name="telefono" type="tel" required />
          <Input label="Correo" name="email" type="email" required />
        </div>
        <Input
          label="Padre, madre o apoderado (si eres menor de edad)"
          name="apoderado"
        />
      </Seccion>

      <Seccion titulo="2. Producto o servicio">
        <Opciones
          nombre="bien"
          opciones={[
            { valor: "producto", titulo: "Producto" },
            { valor: "servicio", titulo: "Servicio" },
          ]}
        />
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
          <Input
            label="Monto reclamado (S/)"
            name="monto"
            inputMode="decimal"
          />
          <Input label="N.º de pedido (si tienes)" name="numero_pedido" />
        </div>
        <Input
          label="Descripción del producto o servicio"
          name="descripcion_bien"
          required
        />
      </Seccion>

      <Seccion titulo="3. Detalle">
        <Opciones
          nombre="tipo"
          opciones={[
            {
              valor: "reclamo",
              titulo: "Reclamo",
              detalle: "Disconformidad con los productos o servicios.",
            },
            {
              valor: "queja",
              titulo: "Queja",
              detalle:
                "Disconformidad no relacionada a los productos o servicios, o malestar con la atención.",
            },
          ]}
        />
        <AreaTexto name="detalle" label="Detalle del reclamo o queja" />
        <AreaTexto name="pedido_consumidor" label="¿Qué solicitas?" />
      </Seccion>

      <label className="flex items-start gap-x-3 txt-small">
        <input type="checkbox" name="acepta" required className="mt-0.5" />
        <span>
          Declaro que los datos son correctos. La formulación del reclamo no
          impide acudir a otras vías de solución de controversias ni es
          requisito previo para interponer una denuncia ante el INDECOPI.
        </span>
      </label>

      <div className="flex flex-col gap-y-2">
        <SubmitButton data-testid="enviar-reclamo">Enviar</SubmitButton>
        <ErrorMessage error={estado && !estado.ok ? estado.error : null} />
      </div>
    </form>
  )
}

export default FormularioReclamo
