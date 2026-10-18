# Tienda DENVER en WooCommerce

Versión WooCommerce de la tienda para la campaña Navidad 2026. Es independiente de la tienda en Medusa (`apps/backend` y `apps/storefront`), que queda pausada: tiene su propia copia de la limpieza del Excel y las reglas de categorías en `scripts/catalogo`, y usa los puertos 8890 en vez de 8888, para no chocar con otros WordPress de prueba.

## Qué hay aquí

| Ruta | Para qué |
|---|---|
| `.wp-env.json` | WordPress local con WooCommerce, plugins y tema |
| `tema/denver` | Tema hijo de Storefront con el logo, colores del afiche, franja de Navidad y botón de WhatsApp |
| `scripts/generar-csv.ts` | Convierte el reporte de productos del sistema de ventas en el CSV de WooCommerce |
| `scripts/catalogo` | Limpieza de nombres y reglas de categorías (copia de las de Medusa) |
| `plugins/denver-configuracion` | Plugin que deja la tienda en soles, IGV 18 % incluido, Yape o Plin, envíos y portada al activarlo. También pide en la compra boleta o factura con DNI o RUC, así que debe quedar activo |
| `config/configurar.php` | Lo mismo para wp-env, más el idioma español |
| `config/importar.php` | Importa el CSV (se puede repetir para actualizar precios y stock) |
| `datos/` | CSV generados (no se suben al repositorio) |

## Levantarla en tu PC

Necesitas Docker abierto y Node 22 o más nuevo. Desde la raíz del repositorio:

```bash
npm install
npm run tienda:start             # la primera vez descarga WordPress y los plugins
npm run tienda:csv -- "/ruta/completa/Reporte - productos 5.xlsx"
npm run tienda:importar
```

Fíjate en el espacio entre `--` y la ruta del Excel.

- Tienda: http://localhost:8890
- Panel: http://localhost:8890/wp-admin (usuario `admin`, clave `password`, solo para tu PC)

`tienda:start` corre `npm run configurar` al terminar. Los ajustes se aplican solo la primera vez, así que lo que cambies después en el panel se respeta.

Para apagarla: `npm run tienda:stop`. Para borrarla y empezar de cero, dentro de `apps/woocommerce`: `npx wp-env destroy`.

Si `tienda:start` dice `address already in use`, otro programa usa el puerto 8890. Apágalo, o cambia `port` en `.wp-env.json`. Si `tienda:importar` dice `Environment not initialized`, es que `tienda:start` no terminó bien: revisa su error.

Si prefieres no usar la terminal para importar, en el panel ve a **Productos > Importar** y sube `datos/productos-woocommerce.csv`. Las columnas se reconocen solas.

## Qué carga el CSV

- 3,293 productos únicos del reporte. Se publican los 384 de Navidad, Juguetes y Regalos que se pueden vender; el resto entra como borrador.
- Los productos con stock vacío o negativo en el reporte se venden sin control de stock.
- Los exonerados de IGV entran sin impuesto. Cada producto guarda su unidad de medida y su código de afectación SUNAT (10 gravado, 20 exonerado) para la facturación.
- `datos/precios-mayoristas.csv` es una plantilla con los productos publicados para llenar los precios por volumen, en formato `cantidad:precio` (por ejemplo `12:2.50,100:2.20`).

## Subirla a un hosting

`npm run zips` crea `datos/denver-tema.zip` y `datos/denver-configuracion.zip`, que se suben desde el panel de WordPress (Apariencia > Temas > Subir tema y Plugins > Subir plugin). El tema necesita Storefront instalado.

## Plugins

| Para | Plugin | En el entorno local |
|---|---|---|
| Tienda | WooCommerce | Sí |
| Tema | Storefront + tema hijo DENVER | Sí |
| Precios por volumen | Tiered Pricing Table for WooCommerce. Los tramos por cantidad son gratis; limitar precios a clientes con RUC es de la versión de pago | Sí |
| Libro de Reclamaciones | NeuroSystems Libro de Reclamaciones Perú | Sí, falta crear su página |
| Pagos con tarjeta y Yape | Izipay para WooCommerce (oficial) | No, necesita la cuenta de Izipay |
| Yape o Plin manual | Transferencia bancaria de WooCommerce, renombrada "Yape o Plin" | Sí, ya configurado |
| Boletas y facturas SUNAT | Nubefact (o el proveedor que ya use la tienda) | No, necesita la cuenta del proveedor |
| Claude en la tienda | WooCommerce for Claude (github.com/woocommerce/woocommerce-claude) | No, se instala con su zip cuando la tienda esté publicada |

## Pendiente antes de publicar

- Fotos de los productos.
- Página del Libro de Reclamaciones, términos y condiciones, y política de privacidad.
- Cuenta de Izipay y de facturación electrónica.
- Revisar en el panel las categorías asignadas por nombre.

## Boletas y facturas

La tienda emite los comprobantes a mano en SUNAT SOL. Cada pedido trae, en "Campos adicionales", el comprobante elegido (boleta o factura), el DNI o RUC y la razón social. La compra no deja continuar con un RUC o DNI mal escrito, ni con factura sin razón social. Estos campos funcionan con la página de finalizar compra de bloques, que es la que WooCommerce crea por defecto.
