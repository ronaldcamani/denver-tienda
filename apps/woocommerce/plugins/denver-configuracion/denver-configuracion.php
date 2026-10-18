<?php
/**
 * Plugin Name: DENVER Configuración
 * Description: Deja WooCommerce listo para vender en Perú: soles, IGV 18 % incluido, Yape o Plin, envío a domicilio, recojo en tienda y portada de Navidad. Los ajustes se aplican una sola vez al activarlo. Además pide en la compra el comprobante (boleta o factura) con DNI o RUC, así que debe quedar activo.
 * Version: 0.2.0
 * Requires Plugins: woocommerce
 * Text Domain: denver
 */

defined( 'ABSPATH' ) || exit;

const DENVER_VERSION_CONFIG = 1;

/**
 * Aplica los ajustes de la tienda solo la primera vez, para no pisar lo que
 * se cambie despues en el panel.
 *
 * @return bool true si aplico los ajustes, false si ya estaban.
 */
function denver_configurar_tienda() {
	if ( (int) get_option( 'denver_config_version' ) >= DENVER_VERSION_CONFIG ) {
		return false;
	}

	if ( wp_get_theme( 'denver' )->exists() ) {
		switch_theme( 'denver' );
	}

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
	return true;
}

register_activation_hook(
	__FILE__,
	function () {
		if ( ! class_exists( 'WooCommerce' ) ) {
			wp_die( 'Activa WooCommerce antes que DENVER Configuración.' );
		}
		denver_configurar_tienda();
	}
);


/*
 * Comprobante en la compra. La tienda emite las boletas y facturas a mano en
 * SUNAT SOL, asi que el pedido tiene que traer el tipo de comprobante y el
 * documento del cliente. Usa los campos adicionales del checkout de bloques
 * (WooCommerce 8.9 o superior); se guardan en el pedido y salen en el panel y
 * en los correos.
 */
add_action(
	'woocommerce_init',
	function () {
		if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
			return;
		}

		woocommerce_register_additional_checkout_field(
			array(
				'id'       => 'denver/comprobante',
				'label'    => 'Comprobante',
				'location' => 'order',
				'type'     => 'select',
				'required' => true,
				'options'  => array(
					array(
						'value' => 'boleta',
						'label' => 'Boleta (con DNI)',
					),
					array(
						'value' => 'factura',
						'label' => 'Factura (con RUC)',
					),
				),
			)
		);
		woocommerce_register_additional_checkout_field(
			array(
				'id'                => 'denver/documento',
				'label'             => 'DNI o RUC',
				'location'          => 'order',
				'type'              => 'text',
				'required'          => true,
				'attributes'        => array(
					'autocomplete' => 'off',
					'maxLength'    => 12,
				),
				'sanitize_callback' => function ( $valor ) {
					return strtoupper( preg_replace( '/[\s.-]/', '', (string) $valor ) );
				},
			)
		);
		woocommerce_register_additional_checkout_field(
			array(
				'id'            => 'denver/razon-social',
				'label'         => 'Razón social',
				'optionalLabel' => 'Razón social (solo para factura)',
				'location'      => 'order',
				'type'          => 'text',
				'required'      => false,
			)
		);
	}
);

// La validacion cruzada va aqui porque depende del tipo de comprobante.
add_action(
	'woocommerce_blocks_validate_location_order_fields',
	function ( WP_Error $errores, $campos ) {
		$comprobante  = isset( $campos['denver/comprobante'] ) ? $campos['denver/comprobante'] : '';
		$documento    = isset( $campos['denver/documento'] ) ? $campos['denver/documento'] : '';
		$razon_social = isset( $campos['denver/razon-social'] ) ? trim( $campos['denver/razon-social'] ) : '';

		if ( 'factura' === $comprobante ) {
			if ( ! preg_match( '/^(10|15|17|20)\d{9}$/', $documento ) ) {
				$errores->add( 'denver_ruc', 'Para factura escribe un RUC de 11 dígitos.' );
			}
			if ( '' === $razon_social ) {
				$errores->add( 'denver_razon_social', 'Para factura escribe la razón social.' );
			}
		} elseif ( 'boleta' === $comprobante ) {
			// DNI de 8 digitos o carne de extranjeria de hasta 12 caracteres.
			if ( ! preg_match( '/^(\d{8}|[A-Z0-9]{9,12})$/', $documento ) ) {
				$errores->add( 'denver_dni', 'Para boleta escribe tu DNI de 8 dígitos o tu carné de extranjería.' );
			}
		}
	},
	10,
	2
);
