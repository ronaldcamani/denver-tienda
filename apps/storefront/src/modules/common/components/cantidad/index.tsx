"use client"

import { clx } from "@modules/common/components/ui"
import { useEffect, useState } from "react"

type CantidadProps = {
  value: number
  onChange: (cantidad: number) => void
  max?: number
  disabled?: boolean
  className?: string
  "data-testid"?: string
}

// Selector de cantidad libre: botones de 1 en 1 y un campo para escribir
// cantidades grandes (docenas, cajas) sin pasar por una lista de opciones.
const Cantidad = ({
  value,
  onChange,
  max = 9999,
  disabled,
  className,
  "data-testid": dataTestId,
}: CantidadProps) => {
  const [texto, setTexto] = useState(String(value))

  useEffect(() => {
    setTexto(String(value))
  }, [value])

  const aplicar = (cantidad: number) => {
    const limpia = Math.min(Math.max(1, Math.floor(cantidad) || 1), max)
    setTexto(String(limpia))
    if (limpia !== value) {
      onChange(limpia)
    }
  }

  const boton =
    "flex items-center justify-center w-9 h-full text-lg text-grey-60 hover:bg-grey-10 disabled:opacity-40 disabled:hover:bg-transparent"

  return (
    <div
      className={clx(
        "flex items-center h-10 rounded-rounded border border-ui-border-base bg-white overflow-hidden",
        className
      )}
      data-testid={dataTestId}
    >
      <button
        type="button"
        className={boton}
        onClick={() => aplicar(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Quitar uno"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={texto}
        disabled={disabled}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => aplicar(Number(texto))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            aplicar(Number(texto))
          }
        }}
        className="w-12 h-full text-center txt-compact-small-plus outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Cantidad"
      />
      <button
        type="button"
        className={boton}
        onClick={() => aplicar(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Agregar uno"
      >
        +
      </button>
    </div>
  )
}

export default Cantidad
