# Publicar la tienda en un VPS

Esta guía deja la tienda en `https://tudominio.pe` y el panel en `https://api.tudominio.pe/app`, con SSL automático, en un VPS de Hostinger (KVM 2: 2 vCPU, 8 GB de RAM). Todo corre en Docker:

| Servicio | Qué hace |
| --- | --- |
| `postgres` | Base de datos (pedidos, productos, clientes, reclamos) |
| `redis` | Cola de eventos y flujos de Medusa |
| `backend` | API de Medusa, panel en `/app` y fotos en `/static` |
| `storefront` | La tienda (Next.js) |
| `caddy` | Recibe el tráfico en los puertos 80 y 443 y saca el certificado SSL |

## 1. Comprar el VPS y el dominio

1. En Hostinger compra un **VPS KVM 2** y elige el sistema **Ubuntu 24.04 with Docker**. Si el panel no lo ofrece, elige Ubuntu 24.04 a secas; en el paso 3 se instala Docker.
2. Anota la **IP** del VPS y la contraseña de `root` que pusiste.
3. Compra el dominio. Un `.pe` se compra en un registrador autorizado por PUNTO.pe; un `.com` se puede comprar en el mismo Hostinger.

## 2. Apuntar el dominio al VPS

En el panel DNS del dominio crea tres registros **A** con la IP del VPS:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | `@` | IP del VPS |
| A | `www` | IP del VPS |
| A | `api` | IP del VPS |

Los cambios pueden tardar desde unos minutos hasta unas horas. Puedes comprobarlo con `ping api.tudominio.pe`: debe responder la IP del VPS.

## 3. Preparar el servidor

Entra por SSH desde la terminal de tu PC:

```bash
ssh root@IP_DEL_VPS
```

Si el VPS no trae Docker, instálalo:

```bash
curl -fsSL https://get.docker.com | sh
```

Abre solo los puertos necesarios:

```bash
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
```

Descarga el proyecto:

```bash
git clone https://github.com/ronaldcamani/denver-tienda.git
cd denver-tienda/deploy
```

Si el repositorio es privado, GitHub pide usuario y contraseña. En contraseña va un token: créalo en GitHub en Settings, Developer settings, Personal access tokens, con permiso de lectura del repositorio.

## 4. Configurar

```bash
cp .env.example .env
nano .env
```

Completa:

- `DOMINIO`: el dominio sin `www` ni `https`, por ejemplo `libreriadenver.pe`.
- `POSTGRES_PASSWORD`, `JWT_SECRET` y `COOKIE_SECRET`: tres claves distintas. Genera cada una con `openssl rand -hex 32` y pégala.
- `SMTP_PASS`: la contraseña de aplicación de Gmail. Se crea en la cuenta de Google, en Seguridad, Verificación en dos pasos, Contraseñas de aplicaciones. Sin ella la tienda funciona, pero no envía correos.

Guarda con `Ctrl+O`, `Enter` y sal con `Ctrl+X`. Este archivo tiene tus claves: no lo compartas ni lo subas a GitHub.

## 5. Primer arranque

```bash
docker compose up -d --build
docker compose logs -f backend
```

La primera vez tarda varios minutos: construye el backend, crea las tablas, la región Perú, los envíos, los medios de pago y 8 productos de prueba. Cuando el log diga `Server is ready on port: 9000`, sal con `Ctrl+C`.

Copia la clave pública de la tienda y levanta la tienda:

```bash
./clave-tienda.sh
docker compose up -d --build
```

Crea tu usuario del panel. Escribe tu correo y una contraseña tuya; quedan solo en el servidor:

```bash
docker compose exec backend medusa user -e tucorreo@gmail.com -p 'TuClaveSegura'
```

Listo:

- Tienda: `https://tudominio.pe`
- Panel: `https://api.tudominio.pe/app`

## 6. Cargar el catálogo real

Desde tu PC, sube el Excel de productos al servidor:

```bash
scp ReporteProductos.xlsx root@IP_DEL_VPS:/root/
```

En el servidor, primero simula y revisa el resumen; luego carga y quita los productos de prueba:

```bash
cd ~/denver-tienda/deploy
docker compose cp /root/ReporteProductos.xlsx backend:/tmp/catalogo.xlsx
docker compose exec backend medusa exec ./src/scripts/importar-catalogo.js /tmp/catalogo.xlsx simular
docker compose exec backend medusa exec ./src/scripts/importar-catalogo.js /tmp/catalogo.xlsx quitar-demo
```

Las fotos se suben desde el panel, en cada producto.

## 7. Respaldos

`respaldo.sh` guarda la base de datos y las fotos en `deploy/respaldos/` y borra los de más de 14 días. Prográmalo todos los días a las 3 a. m.:

```bash
(crontab -l 2>/dev/null; echo "0 3 * * * $HOME/denver-tienda/deploy/respaldo.sh >> $HOME/respaldo.log 2>&1") | crontab -
```

De vez en cuando baja una copia a tu PC, porque si el VPS se pierde, se pierden también sus respaldos:

```bash
scp -r root@IP_DEL_VPS:/root/denver-tienda/deploy/respaldos ./respaldos-denver
```

Para restaurar un respaldo de la base de datos:

```bash
docker compose exec -T postgres pg_restore -U medusa -d denver_medusa --clean --if-exists < respaldos/base-FECHA.dump
```

## 8. Actualizar la tienda

Cuando haya cambios nuevos en GitHub:

```bash
cd ~/denver-tienda/deploy
git pull
docker compose up -d --build
```

El backend aplica solo las migraciones nuevas al arrancar.

## Comandos útiles

```bash
docker compose ps                  # estado de cada servicio
docker compose logs -f storefront  # ver lo que pasa en la tienda
docker compose restart backend     # reiniciar el backend
```

## Si algo falla

- **El candado SSL no aparece:** revisa que los tres registros DNS apunten a la IP del VPS y mira `docker compose logs caddy`.
- **La tienda muestra error 502:** la tienda todavía arranca o le falta la clave. Corre `./clave-tienda.sh` y `docker compose up -d --build`.
- **No llegan correos:** revisa `SMTP_USER` y `SMTP_PASS` en `.env`, y luego `docker compose up -d backend`.
