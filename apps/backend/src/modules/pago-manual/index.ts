import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PagoManualService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [PagoManualService],
})
