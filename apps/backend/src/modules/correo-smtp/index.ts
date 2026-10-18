import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import CorreoSmtpService from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [CorreoSmtpService],
})
