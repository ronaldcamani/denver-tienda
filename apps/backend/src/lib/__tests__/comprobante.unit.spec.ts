import { errorComprobante } from "../comprobante"

describe("errorComprobante", () => {
  it("acepta boleta con DNI o carne de extranjeria", () => {
    expect(errorComprobante({ comprobante: "boleta", documento: "45678912" })).toBeNull()
    expect(errorComprobante({ comprobante: "boleta", documento: "001234567" })).toBeNull()
  })

  it("rechaza boleta con DNI incompleto", () => {
    expect(errorComprobante({ comprobante: "boleta", documento: "4567" })).toMatch(/DNI/)
  })

  it("acepta factura con RUC y razon social", () => {
    expect(
      errorComprobante({
        comprobante: "factura",
        documento: "20610817433",
        razon_social: "IMPORTADORA Y MULTISERVICIOS DENVER S.A.C.",
      })
    ).toBeNull()
  })

  it("rechaza factura sin RUC valido o sin razon social", () => {
    expect(
      errorComprobante({ comprobante: "factura", documento: "45678912", razon_social: "X" })
    ).toMatch(/RUC/)
    expect(errorComprobante({ comprobante: "factura", documento: "20610817433" })).toMatch(
      /razón social/
    )
  })

  it("pide elegir el comprobante", () => {
    expect(errorComprobante({})).toMatch(/boleta o factura/)
  })
})
