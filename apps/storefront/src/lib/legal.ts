// Textos legales de la tienda, tomados del documento "Páginas legales de la
// tienda DENVER" y ajustados a los envíos y pagos de esta tienda. Son un
// borrador base: conviene que un contador o abogado los revise.

export const EMPRESA = {
  razonSocial: "IMPORTADORA Y MULTISERVICIOS DENVER S.A.C.",
  ruc: "20610817433",
  direccion: "Mz. 32 Lote 04, P.J. El Porvenir, Miraflores, Arequipa",
  correo: "libreriadenver@gmail.com",
  whatsapp: "942 295 923",
}

// Un párrafo empieza opcionalmente con una frase en negrita; una lista va como
// arreglo de textos.
export type Parrafo = { negrita?: string; texto: string } | string[]

export type PaginaLegal = {
  slug: string
  titulo: string
  descripcion: string
  parrafos: Parrafo[]
}

const terminos: PaginaLegal = {
  slug: "terminos",
  titulo: "Términos y condiciones",
  descripcion: "Condiciones de compra en la tienda en línea de DENVER.",
  parrafos: [
    {
      negrita: "1. Quiénes somos.",
      texto: `Esta tienda en línea pertenece a ${EMPRESA.razonSocial}, con RUC ${EMPRESA.ruc} y domicilio en ${EMPRESA.direccion}. Puedes escribirnos a ${EMPRESA.correo} o por WhatsApp al ${EMPRESA.whatsapp}.`,
    },
    {
      negrita: "2. Uso de la tienda.",
      texto:
        "Al hacer un pedido aceptas estos términos. Para comprar debes ser mayor de edad o contar con autorización de tus padres o tutores.",
    },
    {
      negrita: "3. Precios.",
      texto:
        "Todos los precios están en soles e incluyen IGV, salvo los productos exonerados por ley. Los precios por cantidad (docena, caja) se aplican solos en el carrito al llegar a la cantidad indicada. Los precios pueden cambiar sin aviso, pero respetamos el precio que figuraba al confirmar tu pedido.",
    },
    {
      negrita: "4. Stock.",
      texto:
        "Las fotos son referenciales. Si un producto se agota después de tu compra, te avisamos por WhatsApp o correo y te ofrecemos cambiarlo por otro similar o devolverte el dinero completo.",
    },
    {
      negrita: "5. Pagos.",
      texto:
        "Aceptamos Yape, Plin y pago al recoger en tienda. Con Yape o Plin, tu pedido se confirma cuando verificamos el pago. Si no lo recibimos en 48 horas, el pedido se anula.",
    },
    {
      negrita: "6. Comprobantes.",
      texto:
        "Emitimos boleta o factura electrónica según lo elijas al comprar. Para factura necesitamos tu RUC y razón social; no podemos cambiar una boleta por factura después de emitida.",
    },
    {
      negrita: "7. Ventas por mayor.",
      texto:
        "Para compras grandes o cotizaciones especiales escríbenos por WhatsApp. Los precios por mayor de la tienda aplican según la cantidad de cada producto.",
    },
    {
      negrita: "8. Libro de Reclamaciones.",
      texto:
        "Conforme al Código de Protección y Defensa del Consumidor (Ley 29571), contamos con un Libro de Reclamaciones virtual, disponible en el enlace al pie de esta página.",
    },
    {
      negrita: "9. Cambios a estos términos.",
      texto:
        "Podemos actualizar estos términos; la versión vigente es la publicada en esta página al momento de tu compra.",
    },
  ],
}

const privacidad: PaginaLegal = {
  slug: "privacidad",
  titulo: "Política de privacidad",
  descripcion: "Cómo cuidamos y usamos tus datos personales.",
  parrafos: [
    {
      negrita: "1. Responsable.",
      texto: `${EMPRESA.razonSocial}, RUC ${EMPRESA.ruc}, con domicilio en ${EMPRESA.direccion}, es responsable de los datos personales que nos das en esta tienda, conforme a la Ley de Protección de Datos Personales (Ley 29733) y su reglamento.`,
    },
    {
      negrita: "2. Qué datos pedimos.",
      texto:
        "Nombre, DNI o RUC, teléfono, correo y dirección de entrega. No guardamos datos de tarjetas.",
    },
    {
      negrita: "3. Para qué los usamos.",
      texto:
        "Para procesar y entregar tu pedido, emitir tu boleta o factura, atender tus consultas y reclamos, y, solo si lo aceptas, enviarte ofertas y novedades.",
    },
    {
      negrita: "4. Con quién los compartimos.",
      texto:
        "Solo con quienes nos ayudan a completar tu compra: el servicio de reparto, nuestro proveedor de hosting y el de correo. No vendemos tus datos.",
    },
    {
      negrita: "5. Cuánto tiempo los guardamos.",
      texto:
        "Mientras tengas una cuenta o un pedido activo, y después el tiempo que exigen las normas tributarias.",
    },
    {
      negrita: "6. Tus derechos.",
      texto: `Puedes pedir acceder, corregir, cancelar u oponerte al uso de tus datos (derechos ARCO) escribiendo a ${EMPRESA.correo}. Respondemos en los plazos de ley. Si no estás conforme, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.`,
    },
    {
      negrita: "7. Cookies.",
      texto:
        "Usamos cookies necesarias para que funcionen el carrito y tu cuenta. Puedes borrarlas desde tu navegador.",
    },
  ],
}

const envios: PaginaLegal = {
  slug: "envios-y-devoluciones",
  titulo: "Envíos, cambios y devoluciones",
  descripcion: "Costos y plazos de entrega, y cómo pedir un cambio.",
  parrafos: [
    {
      negrita: "Delivery en Arequipa.",
      texto:
        "Repartimos en Arequipa Metropolitana por S/ 10. Entregamos en 1 a 3 días hábiles desde que confirmamos tu pago.",
    },
    {
      negrita: "Envío a provincias.",
      texto:
        "Enviamos por agencia a todo el Perú por S/ 20 hasta la agencia de tu ciudad. Te enviamos la clave de recojo por WhatsApp.",
    },
    {
      negrita: "Recojo en tienda.",
      texto: `Es gratis en ${EMPRESA.direccion}. Te avisamos por WhatsApp cuando tu pedido esté listo; trae tu DNI y tu número de pedido. Guardamos el pedido 7 días.`,
    },
    {
      negrita: "Al recibir.",
      texto:
        "Revisa tu pedido delante del repartidor. Si algo llegó dañado o falta un producto, anótalo en la guía y escríbenos el mismo día con una foto.",
    },
    {
      negrita: "Cambios y devoluciones.",
      texto:
        "Tienes 7 días desde que recibes tu pedido para pedir un cambio o devolución si el producto:",
    },
    [
      "llegó fallado o dañado,",
      "no es el que pediste, o",
      "no coincide con la descripción de la tienda.",
    ],
    {
      texto:
        "En esos casos el envío de vuelta corre por nuestra cuenta y te devolvemos el dinero por el mismo medio de pago, o cambiamos el producto, como prefieras. El producto debe estar sin usar y con su empaque.",
    },
    {
      negrita: "Lo que no se cambia.",
      texto:
        "Productos usados o abiertos sin falla, productos hechos a pedido o personalizados, y compras por mayor ya entregadas y conformes, salvo falla de fábrica.",
    },
    {
      negrita: "Reclamos.",
      texto:
        "Si no estás conforme con nuestra respuesta, puedes registrar tu queja o reclamo en nuestro Libro de Reclamaciones virtual. Respondemos en un plazo máximo de 15 días hábiles.",
    },
  ],
}

export const PAGINAS_LEGALES = [terminos, privacidad, envios]

export const paginaLegal = (slug: string) =>
  PAGINAS_LEGALES.find((p) => p.slug === slug)
