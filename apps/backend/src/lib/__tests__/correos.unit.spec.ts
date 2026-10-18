import { PedidoCorreo, correoCliente, correoTienda } from "../correos"

const pedido: PedidoCorreo = {
  display_id: 7,
  email: "ana@correo.pe",
  total: 22.9,
  shipping_total: 10,
  items: [{ title: "Colores <largos>", subtitle: "x 12", quantity: 1, total: 12.9 }],
  shipping_address: { first_name: "Ana", last_name: "Perez", address_1: "Av. 1", city: "Arequipa", phone: "999" },
  shipping_methods: [{ name: "Delivery en la ciudad" }],
  metadata: { comprobante: "factura", documento: "20610817433", razon_social: "EMPRESA SAC" },
  proveedor_pago: "pp_manual_yape",
}

describe("correos del pedido", () => {
  it("arma el correo del cliente con instrucciones de Yape y comprobante", () => {
    const correo = correoCliente(pedido)
    expect(correo.asunto).toBe("Recibimos tu pedido N.º 7 en DENVER")
    expect(correo.html).toContain("942 295 923")
    expect(correo.html).toContain("Factura a EMPRESA SAC (RUC 20610817433)")
    expect(correo.html).toContain("S/ 22.90")
    expect(correo.html).toContain("Colores &lt;largos&gt;")
    expect(correo.texto).toContain("Pago: Yape o Plin")
  })

  it("arma el aviso a la tienda", () => {
    const correo = correoTienda(pedido)
    expect(correo.asunto).toBe("Pedido nuevo N.º 7: S/ 22.90 con Yape o Plin")
    expect(correo.texto).toContain("Cliente: Ana Perez (ana@correo.pe) 999")
  })
})
