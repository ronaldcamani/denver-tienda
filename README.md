# Tienda DENVER

Tienda virtual mayorista y minorista de Importadora y Multiservicios DENVER: útiles escolares, de oficina y campañas de temporada.

- `apps/backend`: Medusa v2 (catálogo, precios, pedidos, panel de administración en `/app`).
- `apps/storefront`: tienda en Next.js.

La guía original del starter de Medusa está en [MEDUSA.md](./MEDUSA.md).

## Qué trae configurado

- Región Perú en soles (PEN), con precios que ya incluyen el IGV de 18 %.
- Precios por escala según la cantidad en el carrito: unidad (1 a 11), docena (12 a 47) y caja (48 a más).
- Grupo de clientes **Mayorista** con su lista de precios. Un cliente pasa a mayorista cuando se le agrega al grupo desde el panel (Clientes > Grupos).
- Envíos: delivery en la ciudad, envío a provincias por agencia y recojo en tienda.
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

Pega en `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` de `apps/storefront/.env.local` la clave que aparece en el panel (Settings > Publishable API Keys, "Storefront DENVER"). Luego:

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
