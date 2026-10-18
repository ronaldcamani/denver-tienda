import { BuildingStorefront, CreditCard, Phone } from "@medusajs/icons"
import Bancontact from "@modules/common/icons/bancontact"
import Ideal from "@modules/common/icons/ideal"
import PayPal from "@modules/common/icons/paypal"
import React from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Tarjeta de crédito o débito",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Tarjeta de crédito o débito",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Pago manual",
    icon: <CreditCard />,
  },
  pp_manual_yape: {
    title: "Yape o Plin",
    icon: <Phone />,
  },
  pp_manual_recojo: {
    title: "Pago al recoger en tienda",
    icon: <BuildingStorefront />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
// Instrucciones de los pagos que la tienda confirma a mano. Se muestran al
// elegir el medio y en la pagina del pedido.
export const NUMERO_YAPE = "942 295 923"
export const instruccionesPago: Record<string, string> = {
  pp_manual_yape: `Yapea o plinea el total al ${NUMERO_YAPE} (DENVER) y envíanos la captura por WhatsApp con tu número de pedido. Despachamos cuando confirmamos el pago.`,
  pp_manual_recojo:
    "Pagas en efectivo, Yape o tarjeta cuando recoges tu pedido en la tienda. Te escribimos por WhatsApp cuando esté listo.",
}

// Solo se puede pagar al recoger si el pedido se recoge en tienda.
export const RECOJO_EN_TIENDA = "Recojo en tienda"
export const esPagoAlRecoger = (providerId?: string) =>
  providerId === "pp_manual_recojo"

// Yape o Plin y pago al recoger: el pedido se crea sin pasarela.
export const esPagoConfirmadoEnTienda = (providerId?: string) =>
  !!providerId?.startsWith("pp_manual_")

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
