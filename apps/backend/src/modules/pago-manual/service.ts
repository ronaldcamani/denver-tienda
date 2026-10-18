import crypto from "crypto"
import {
  AbstractPaymentProvider,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

// Pagos que la tienda confirma a mano: Yape o Plin al numero de la tienda y
// pago al recoger. El pedido entra autorizado y se marca como pagado desde el
// panel (Pedidos > Pago > Capturar) cuando llega el dinero. Se registra una vez
// por cada medio (ver medusa-config.ts), asi cada uno tiene su propio id.
class PagoManualService extends AbstractPaymentProvider {
  static identifier = "manual"

  constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
    super(container, options)
  }

  async initiatePayment(
    _input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    return { id: crypto.randomUUID(), data: {} }
  }

  async authorizePayment(
    _input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return { status: PaymentSessionStatus.AUTHORIZED, data: {} }
  }

  async getPaymentStatus(
    _input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    return { status: PaymentSessionStatus.AUTHORIZED }
  }

  async retrievePayment(
    _input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return { data: {} }
  }

  async updatePayment(
    _input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    return { data: {} }
  }

  async capturePayment(
    _input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: {} }
  }

  async refundPayment(
    _input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    return { data: {} }
  }

  async cancelPayment(
    _input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return { data: {} }
  }

  async deletePayment(
    _input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: {} }
  }

  async getWebhookActionAndData(
    _payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return { action: PaymentActions.NOT_SUPPORTED }
  }
}

export default PagoManualService
