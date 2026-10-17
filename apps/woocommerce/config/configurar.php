<?php
/**
 * Deja la tienda local lista para vender en Peru. Lo corre wp-env despues de
 * cada `start`, asi que solo aplica los ajustes la primera vez: lo que cambies
 * despues en el panel no se pisa.
 *
 * Uso: npm run configurar
 */

if ( ! class_exists( 'WooCommerce' ) ) {
	WP_CLI::error( 'WooCommerce no esta activo.' );
}

const DENVER_VERSION_CONFIG = 1;

if ( (int) get_option( 'denver_config_version' ) >= DENVER_VERSION_CONFIG ) {
	WP_CLI::log( 'La tienda ya estaba configurada.' );
	return;
}

function denver_wp( $comando ) {
	$resultado = WP_CLI::runcommand(
		$comando,
		array(
			'return'     => 'all',
			'exit_error' => false,
			'launch'     => false,
		)
	);
	if ( $resultado->return_code ) {
		WP_CLI::warning( "No se pudo ejecutar \"wp $comando\": {$resultado->stderr}" );
	}
}

// Idioma, tema y datos del sitio.
denver_wp( 'language core install es_PE --activate' );
denver_wp( 'language plugin install woocommerce storefront es_PE' );
denver_wp( 'language theme install storefront es_PE' );
switch_theme( 'denver' );

update_option( 'blogname', 'DENVER Librería' );
update_option( 'blogdescription', 'Útiles escolares, de oficina y regalos por mayor y menor' );
update_option( 'timezone_string', 'America/Lima' );
update_option( 'date_format', 'd/m/Y' );
update_option( 'permalink_structure', '/%postname%/' );

// Moneda en soles y precios con IGV incluido, como en el sistema de ventas.
$opciones = array(
	'woocommerce_default_country'           => 'PE',
	'woocommerce_allowed_countries'         => 'specific',
	'woocommerce_specific_allowed_countries' => array( 'PE' ),
	'woocommerce_ship_to_countries'         => '',
	'woocommerce_currency'                  => 'PEN',
	'woocommerce_currency_pos'              => 'left_space',
	'woocommerce_price_thousand_sep'        => ',',
	'woocommerce_price_decimal_sep'         => '.',
	'woocommerce_price_num_decimals'        => 2,
	'woocommerce_calc_taxes'                => 'yes',
	'woocommerce_prices_include_tax'        => 'yes',
	'woocommerce_tax_based_on'              => 'base',
	'woocommerce_tax_display_shop'          => 'incl',
	'woocommerce_tax_display_cart'          => 'incl',
	'woocommerce_tax_total_display'         => 'single',
	'woocommerce_weight_unit'               => 'kg',
	'woocommerce_dimension_unit'            => 'cm',
	'woocommerce_enable_guest_checkout'     => 'yes',
	'woocommerce_coming_soon'               => 'no',
	'woocommerce_onboarding_profile'        => array( 'skipped' => true ),
);
foreach ( $opciones as $nombre => $valor ) {
	update_option( $nombre, $valor );
}

// IGV 18 % para todo Peru. Los productos exonerados vienen del CSV sin impuesto.
global $wpdb;
$hay_igv = $wpdb->get_var(
	"SELECT COUNT(*) FROM {$wpdb->prefix}woocommerce_tax_rates WHERE tax_rate_country = 'PE' AND tax_rate_name = 'IGV'"
);
if ( ! $hay_igv ) {
	WC_Tax::_insert_tax_rate(
		array(
			'tax_rate_country'  => 'PE',
			'tax_rate_state'    => '',
			'tax_rate'          => '18.0000',
			'tax_rate_name'     => 'IGV',
			'tax_rate_priority' => 1,
			'tax_rate_compound' => 0,
			'tax_rate_shipping' => 1,
			'tax_rate_order'    => 0,
			'tax_rate_class'    => '',
		)
	);
}

// Yape o Plin con verificacion manual hasta tener la pasarela (Izipay).
$instrucciones = 'Yapea o plinea el total al 942 295 923 y envíanos la captura por WhatsApp con tu número de pedido. Despachamos cuando confirmamos el pago.';
update_option(
	'woocommerce_bacs_settings',
	array(
		'enabled'      => 'yes',
		'title'        => 'Yape o Plin',
		'description'  => $instrucciones,
		'instructions' => $instrucciones,
	)
);
update_option(
	'woocommerce_cod_settings',
	array(
		'enabled'            => 'yes',
		'title'              => 'Pago al recoger en tienda',
		'description'        => 'Pagas en efectivo, Yape o tarjeta cuando recoges tu pedido.',
		'instructions'       => 'Te escribimos por WhatsApp cuando tu pedido esté listo para recoger.',
		'enable_for_methods' => array( 'local_pickup' ),
		'enable_for_virtual' => 'no',
	)
);

// Envio a todo Peru con tarifa plana y recojo en tienda gratis.
$zona_existe = false;
foreach ( WC_Shipping_Zones::get_zones() as $zona ) {
	if ( 'Perú' === $zona['zone_name'] ) {
		$zona_existe = true;
	}
}
if ( ! $zona_existe ) {
	$zona = new WC_Shipping_Zone();
	$zona->set_zone_name( 'Perú' );
	$zona->add_location( 'PE', 'country' );
	$zona->save();

	$envio = $zona->add_shipping_method( 'flat_rate' );
	update_option(
		"woocommerce_flat_rate_{$envio}_settings",
		array(
			'title'      => 'Envío a domicilio',
			'tax_status' => 'taxable',
			'cost'       => '20',
		)
	);
	$recojo = $zona->add_shipping_method( 'local_pickup' );
	update_option(
		"woocommerce_local_pickup_{$recojo}_settings",
		array(
			'title'      => 'Recojo en tienda',
			'tax_status' => 'none',
			'cost'       => '0',
		)
	);
}

// Portada con la plantilla de inicio de Storefront.
$portada = get_page_by_path( 'inicio' );
if ( ! $portada ) {
	$id_portada = wp_insert_post(
		array(
			'post_title'   => 'Navidad 2026',
			'post_name'    => 'inicio',
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_content' => '<!-- wp:paragraph --><p>Árboles, adornos, juguetes y regalos para esta Navidad. Precios por mayor y menor.</p><!-- /wp:paragraph -->',
		)
	);
	update_post_meta( $id_portada, '_wp_page_template', 'template-homepage.php' );
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $id_portada );
}

flush_rewrite_rules();
update_option( 'denver_config_version', DENVER_VERSION_CONFIG );
WP_CLI::success( 'Tienda configurada: soles, IGV 18 %, Yape o Plin, envíos y tema DENVER.' );
