"use client"
import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import { Heading, Text, clx } from "@modules/common/components/ui"
import { useState } from "react"

const OPCIONES = [
  {
    valor: "boleta",
    titulo: "Boleta",
    detalle: "Con tu DNI o carné de extranjería",
  },
  {
    valor: "factura",
    titulo: "Factura",
    detalle: "Con el RUC y la razón social de tu empresa",
  },
] as const

// Tipo de comprobante y documento del cliente. Va dentro del formulario de
// direcciones, que lo guarda en la metadata del carrito (setAddresses).
const Comprobante = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const metadata = (cart?.metadata ?? {}) as Record<string, string | undefined>
  const [tipo, setTipo] = useState(metadata.comprobante ?? "boleta")
  const [documento, setDocumento] = useState(metadata.documento ?? "")
  const [razonSocial, setRazonSocial] = useState(metadata.razon_social ?? "")
  const esFactura = tipo === "factura"

  return (
    <div className="pt-8">
      <Heading level="h2" className="text-3xl-regular pb-2">
        Comprobante
      </Heading>
      <Text className="txt-medium text-ui-fg-subtle pb-4">
        Te enviamos la boleta o factura electrónica a tu correo.
      </Text>
      <div className="grid grid-cols-1 small:grid-cols-2 gap-3 pb-4">
        {OPCIONES.map((opcion) => (
          <label
            key={opcion.valor}
            className={clx(
              "flex flex-col gap-y-1 cursor-pointer border rounded-rounded px-6 py-4 hover:shadow-borders-interactive-with-active",
              { "border-ui-border-interactive": tipo === opcion.valor }
            )}
          >
            <span className="flex items-center gap-x-3">
              <input
                type="radio"
                name="comprobante"
                value={opcion.valor}
                checked={tipo === opcion.valor}
                onChange={() => setTipo(opcion.valor)}
                className="accent-ui-fg-interactive"
                data-testid={`comprobante-${opcion.valor}`}
              />
              <span className="text-base-regular">{opcion.titulo}</span>
            </span>
            <span className="txt-small text-ui-fg-subtle pl-7">
              {opcion.detalle}
            </span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <Input
          label={esFactura ? "RUC" : "DNI o carné de extranjería"}
          name="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          inputMode={esFactura ? "numeric" : "text"}
          maxLength={esFactura ? 11 : 12}
          required
          data-testid="documento-input"
        />
        {esFactura && (
          <Input
            label="Razón social"
            name="razon_social"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            autoComplete="organization"
            required
            data-testid="razon-social-input"
          />
        )}
      </div>
    </div>
  )
}

export default Comprobante
