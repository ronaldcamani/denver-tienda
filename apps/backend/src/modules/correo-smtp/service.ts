import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import nodemailer, { Transporter } from "nodemailer"

type Opciones = {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

// Envia los correos por SMTP: Gmail con clave de aplicacion, el correo del
// hosting o cualquier otro. El asunto y el cuerpo llegan armados en `content`.
class CorreoSmtpService extends AbstractNotificationProviderService {
  static identifier = "correo-smtp"

  protected transporter: Transporter
  protected from: string
  protected logger: Logger

  constructor({ logger }: { logger: Logger }, opciones: Opciones) {
    super()
    this.logger = logger
    this.from = opciones.from
    this.transporter = nodemailer.createTransport({
      host: opciones.host,
      port: opciones.port,
      secure: opciones.port === 465,
      auth: { user: opciones.user, pass: opciones.pass },
    })
  }

  static validateOptions(opciones: Record<string, unknown>) {
    for (const clave of ["host", "port", "user", "pass", "from"]) {
      if (!opciones[clave]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Falta la opcion "${clave}" del correo SMTP.`
        )
      }
    }
  }

  async send(
    notificacion: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const contenido = notificacion.content
    if (!contenido?.subject) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `La notificacion "${notificacion.template}" no trae asunto.`
      )
    }
    const enviado = await this.transporter.sendMail({
      from: notificacion.from || this.from,
      to: notificacion.to,
      subject: contenido.subject,
      text: contenido.text,
      html: contenido.html,
    })
    this.logger.info(`Correo "${contenido.subject}" enviado a ${notificacion.to}`)
    return { id: enviado.messageId }
  }
}

export default CorreoSmtpService
