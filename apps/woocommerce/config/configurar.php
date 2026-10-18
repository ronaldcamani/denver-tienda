<?php
/**
 * Version para wp-env del plugin DENVER Configuración: instala el idioma y
 * aplica los mismos ajustes. Lo corre wp-env despues de cada `start`; los
 * ajustes solo se aplican la primera vez.
 *
 * Uso: npm run configurar
 */

if ( ! class_exists( 'WooCommerce' ) ) {
	WP_CLI::error( 'WooCommerce no esta activo.' );
}

require_once WP_CONTENT_DIR . '/plugins/denver-configuracion/denver-configuracion.php';

if ( (int) get_option( 'denver_config_version' ) >= DENVER_VERSION_CONFIG ) {
	WP_CLI::log( 'La tienda ya estaba configurada.' );
	return;
}

foreach (
	array(
		'language core install es_PE --activate',
		'language plugin install woocommerce es_PE',
		'language theme install storefront es_PE',
	) as $comando
) {
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

denver_configurar_tienda();
WP_CLI::success( 'Tienda configurada: soles, IGV 18 %, Yape o Plin, envios y tema DENVER.' );
