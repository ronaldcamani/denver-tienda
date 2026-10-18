# Tienda DENVER

Tienda virtual mayorista y minorista de Importadora y Multiservicios DENVER: útiles escolares, de oficina y campañas de temporada.

## Tienda activa: Medusa

La campaña de Navidad 2026 sale con Medusa:

- `apps/backend`: Medusa v2 (catálogo, precios, pedidos, panel de administración en `/app`).
- `apps/storefront`: tienda en Next.js.

Para publicarla en un VPS con dominio y SSL, sigue [deploy/README.md](./deploy/README.md). La guía original del starter de Medusa está en [MEDUSA.md](./MEDUSA.md).

## Respaldo: WooCommerce

La versión en WooCommerce queda en `apps/woocommerce` como alternativa. Es independiente de Medusa: no usa su base de datos, su Docker Compose ni sus puertos. Se corre desde la raíz del repositorio:

```bash
npm install
npm run tienda:start                                     # WordPress en http://localhost:8890
npm run tienda:csv -- "/ruta/completa/ReporteProductos.xlsx"
npm run tienda:importar
npm run tienda:stop                                      # para apagarla
```

Necesitas Docker abierto. El panel está en http://localhost:8890/wp-admin (usuario `admin`, clave `password`). Más detalles en [apps/woocommerce/README.md](./apps/woocommerce/README.md).

## Qué trae configurado

- Región Perú en soles (PEN), con precios que ya incluyen el IGV de 18 %.
- Precios por escala según la cantidad en el carrito: unidad (1 a 11), docena (12 a 47) y caja (48 a más).
- Grupo de clientes **Mayorista** con su lista de precios. Un cliente pasa a mayorista cuando se le agrega al grupo desde el panel (Clientes > Grupos).
- Envíos: delivery en la ciudad, envío a provincias por agencia y recojo en tienda.
- Pagos: Yape o Plin al 942 295 923 y pago al recoger (solo con recojo en tienda). El pedido entra como autorizado y se marca pagado en el panel con **Capture payment** cuando llega el dinero.
- Correos: al hacer un pedido, el cliente recibe la confirmación con las instrucciones de pago y la tienda recibe un aviso. Se configuran con las variables `SMTP_*` y `CORREO_TIENDA` de `apps/backend/.env` (ver `.env.template`); sin ellas, los correos solo salen en el log.
- Comprobante: en el checkout el cliente elige boleta (DNI o carné de extranjería) o factura (RUC y razón social). Sale en el pedido del panel, en el recuadro **Comprobante**, para emitirlo en SUNAT SOL.
- Páginas legales: términos y condiciones, política de privacidad y envíos y devoluciones, con los textos en `apps/storefront/src/lib/legal.ts`. Enlazadas en la columna **Ayuda** del pie de página.
- Libro de Reclamaciones virtual (Ley 29571) en `/libro-de-reclamaciones`. Cada hoja se numera sola y se envía por correo al consumidor y a la tienda. Se responde desde el panel, en **Reclamaciones**, dentro de los 15 días hábiles; la respuesta llega al correo del consumidor. Requiere `npx medusa db:migrate` para crear la tabla.
- Catálogo de prueba de 8 productos en `apps/backend/src/migration-scripts/data/catalogo-demo.ts`. Se reemplaza por el catálogo real.

## Desarrollo local

Requisitos: Node 22 (Medusa no soporta aún versiones más nuevas), npm y Docker.

```bash
docker compose up -d                                     # PostgreSQL en 5432 y Redis en 6379
npm install
cp apps/backend/.env.template apps/backend/.env          # ya apunta a la base de Docker
cd apps/backend
npx medusa db:migrate                                    # crea tablas y carga los datos de prueba
npx medusa user -e admin@ejemplo.pe -p <clave>           # usuario del panel
cd ../..
cp apps/storefront/.env.template apps/storefront/.env.local
```

La tienda necesita la clave pública "Storefront DENVER", que se crea sola con `db:migrate`. Para verla, arranca primero solo el backend:

```bash
cd apps/backend && npm run dev
```

Entra a http://localhost:9000/app con el usuario que creaste, abre **Settings** (abajo a la izquierda) y luego **Publishable API Keys**. Copia la clave de "Storefront DENVER" (empieza con `pk_`). También puedes sacarla sin el panel:

```bash
docker compose exec postgres psql -U medusa denver_medusa -c "select token from api_key where type = 'publishable'"
```

Pégala en `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` de `apps/storefront/.env.local`, detén el backend con Ctrl+C y, desde la raíz del repo, arranca todo:

```bash
npm run dev
```

- Backend y panel: http://localhost:9000/app
- Tienda: http://localhost:8000/pe

Si `db:migrate` dice `ECONNREFUSED 127.0.0.1:5432`, PostgreSQL no está corriendo: revisa `docker compose ps`.

## Cargar el catálogo real

El catálogo sale del reporte de productos del sistema de ventas en Excel (columnas NOMBRE, PRECIO, PRECIO SIN IGV, UN. MEDIDA, STOCK, CAT. PRODUCTO). Desde `apps/backend`:

```bash
npx medusa exec ./src/scripts/importar-catalogo.ts ruta/al/reporte.xlsx simular      # solo muestra el resumen
npx medusa exec ./src/scripts/importar-catalogo.ts ruta/al/reporte.xlsx quitar-demo   # carga todo y borra los 8 productos de prueba
```

- La categoría se asigna por palabras del nombre, según `src/scripts/catalogo/categorias.ts`. Lo que no coincide queda en "Otros".
- Solo se publican las categorías de la campaña activa (`CATEGORIAS_CAMPANA`, hoy Navidad, Regalos y Juguetes). El resto queda en borrador y no se ve en la tienda.
- Si el Excel trae el stock vacío o negativo, el producto se vende sin control de stock hasta que se cuente.
- Se puede volver a correr con un Excel nuevo: crea los productos nuevos y actualiza la categoría y la publicación de los que ya existen. No cambia precios ni stock de los existentes.
- Para cambiar de campaña, edita `CATEGORIAS_CAMPANA` en el backend y `CAMPANA` en `apps/storefront/src/lib/campana.ts`, y vuelve a correr el script.

Después de actualizar el código, corre siempre `npx medusa db:migrate`: también actualiza el índice del buscador.
