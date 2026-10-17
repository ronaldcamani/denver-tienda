<?php
/**
 * Importa datos/productos-woocommerce.csv con el mismo importador que usa
 * Productos > Importar en el panel. Se puede repetir: los productos que ya
 * existen (por SKU) se actualizan con el precio, stock y estado del CSV.
 *
 * Uso: npm run importar
 */

if ( ! class_exists( 'WooCommerce' ) ) {
	WP_CLI::error( 'WooCommerce no esta activo.' );
}

$archivo = WP_CONTENT_DIR . '/denver-datos/productos-woocommerce.csv';
if ( ! is_readable( $archivo ) ) {
	WP_CLI::error( "No encuentro $archivo. Genéralo antes con: npm run csv -- \"ruta/Reporte - productos.xlsx\"" );
}

if ( ! class_exists( 'WC_Product_CSV_Importer' ) ) {
	include_once WC_ABSPATH . 'includes/import/class-wc-product-csv-importer.php';
}

// Mismos nombres de columna que reconoce el importador del panel.
$columnas = array(
	'Type'                  => 'type',
	'SKU'                   => 'sku',
	'Name'                  => 'name',
	'Published'             => 'published',
	'Visibility in catalog' => 'catalog_visibility',
	'Tax status'            => 'tax_status',
	'In stock?'             => 'stock_status',
	'Stock'                 => 'stock_quantity',
	'Backorders allowed?'   => 'backorders',
	'Regular price'         => 'regular_price',
	'Categories'            => 'category_ids',
);

$lector     = fopen( $archivo, 'r' );
$encabezado = fgetcsv( $lector, 0, ',', '"', "\0" );
fclose( $lector );
$encabezado[0] = preg_replace( '/^\xEF\xBB\xBF/', '', $encabezado[0] );

$desde = array();
$hacia = array();
foreach ( $encabezado as $columna ) {
	$desde[] = $columna;
	if ( isset( $columnas[ $columna ] ) ) {
		$hacia[] = $columnas[ $columna ];
	} elseif ( 0 === strpos( $columna, 'Meta: ' ) ) {
		$hacia[] = 'meta:' . substr( $columna, 6 );
	} else {
		WP_CLI::error( "Columna desconocida en el CSV: $columna" );
	}
}

function denver_importar( $archivo, $desde, $hacia, $actualizar ) {
	$importador = new WC_Product_CSV_Importer(
		$archivo,
		array(
			'mapping'          => array(
				'from' => $desde,
				'to'   => $hacia,
			),
			'parse'            => true,
			'update_existing'  => $actualizar,
			'prevent_timeouts' => false,
		)
	);
	return $importador->import();
}

WP_CLI::log( 'Creando productos nuevos...' );
$creacion = denver_importar( $archivo, $desde, $hacia, false );

// Los que ya existian se saltan al crear; se actualizan en una segunda pasada.
$ya_existian = 0;
$errores     = array();
foreach ( $creacion['skipped'] as $saltado ) {
	if ( 'woocommerce_product_importer_error' === $saltado->get_error_code() ) {
		$ya_existian++;
	} else {
		$errores[] = $saltado;
	}
}
foreach ( $creacion['failed'] as $fallido ) {
	$errores[] = $fallido;
}

$actualizados = 0;
if ( $ya_existian ) {
	WP_CLI::log( "Actualizando $ya_existian productos que ya estaban..." );
	$actualizacion = denver_importar( $archivo, $desde, $hacia, true );
	$actualizados  = count( $actualizacion['updated'] );
	foreach ( $actualizacion['failed'] as $fallido ) {
		$errores[] = $fallido;
	}
}

foreach ( array_slice( $errores, 0, 20 ) as $error ) {
	$datos = $error->get_error_data();
	$fila  = isset( $datos['row'] ) ? $datos['row'] : '?';
	WP_CLI::warning( "Fila $fila: " . $error->get_error_message() );
}

// Menu principal con las categorias de la campana.
$menu = wp_get_nav_menu_object( 'Principal' );
if ( ! $menu ) {
	$id_menu = wp_create_nav_menu( 'Principal' );
	wp_update_nav_menu_item(
		$id_menu,
		0,
		array(
			'menu-item-title'  => 'Inicio',
			'menu-item-url'    => home_url( '/' ),
			'menu-item-status' => 'publish',
		)
	);
	foreach ( array( 'Navidad', 'Juguetes', 'Regalos' ) as $nombre ) {
		$categoria = get_term_by( 'name', $nombre, 'product_cat' );
		if ( $categoria ) {
			wp_update_nav_menu_item(
				$id_menu,
				0,
				array(
					'menu-item-title'     => $nombre,
					'menu-item-object'    => 'product_cat',
					'menu-item-object-id' => $categoria->term_id,
					'menu-item-type'      => 'taxonomy',
					'menu-item-status'    => 'publish',
				)
			);
		}
	}
	$ubicaciones            = get_theme_mod( 'nav_menu_locations', array() );
	$ubicaciones['primary'] = $id_menu;
	$ubicaciones['handheld'] = $id_menu;
	set_theme_mod( 'nav_menu_locations', $ubicaciones );
}

wc_update_product_lookup_tables();
WP_CLI::success(
	sprintf(
		'Creados: %d, actualizados: %d, con error: %d.',
		count( $creacion['imported'] ),
		$actualizados,
		count( $errores )
	)
);
