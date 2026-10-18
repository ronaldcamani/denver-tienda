import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261018031609 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reclamo" ("id" text not null, "numero" serial, "tipo" text check ("tipo" in ('reclamo', 'queja')) not null, "nombre" text not null, "tipo_documento" text check ("tipo_documento" in ('dni', 'ce', 'pasaporte', 'ruc')) not null, "documento" text not null, "domicilio" text not null, "telefono" text not null, "email" text not null, "apoderado" text null, "bien" text check ("bien" in ('producto', 'servicio')) not null, "monto" real null, "descripcion_bien" text not null, "numero_pedido" text null, "detalle" text not null, "pedido_consumidor" text not null, "respuesta" text null, "fecha_respuesta" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reclamo_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reclamo_deleted_at" ON "reclamo" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reclamo" cascade;`);
  }

}
