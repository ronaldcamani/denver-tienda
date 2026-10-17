<?php
/**
 * Tema DENVER: hijo de Storefront con la marca del afiche.
 */

const DENVER_WHATSAPP         = '51942295923';
const DENVER_WHATSAPP_VISIBLE = '942 295 923';

// Storefront ya carga el style.css de este tema hijo despues del suyo.

// Colores de marca como valores por defecto del personalizador; se pueden
// cambiar en Apariencia > Personalizar sin tocar el tema.
add_filter(
	'storefront_setting_default_values',
	function ( $valores ) {
		return array_merge(
			$valores,
			array(
				'storefront_heading_color'               => '#0A1B5C',
				'storefront_text_color'                  => '#374151',
				'storefront_accent_color'                => '#1F6BFF',
				'storefront_hero_heading_color'          => '#0A1B5C',
				'storefront_hero_text_color'             => '#374151',
				'storefront_header_background_color'     => '#0A1B5C',
				'storefront_header_text_color'           => '#D5E5FF',
				'storefront_header_link_color'           => '#FFFFFF',
				'storefront_footer_background_color'     => '#0A1B5C',
				'storefront_footer_heading_color'        => '#FFE11F',
				'storefront_footer_text_color'           => '#D5E5FF',
				'storefront_footer_link_color'           => '#FFFFFF',
				'storefront_button_background_color'     => '#FFE11F',
				'storefront_button_text_color'           => '#0A1B5C',
				'storefront_button_alt_background_color' => '#B91F24',
				'storefront_button_alt_text_color'       => '#FFFFFF',
			)
		);
	}
);

// Logo del afiche en lugar del titulo del sitio. Storefront permite
// reemplazar esta funcion desde el tema hijo.
function storefront_site_branding() {
	?>
	<div class="site-branding">
		<a class="denver-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="DENVER Librería, ir al inicio">
			<svg viewBox="0 0 48 40" aria-hidden="true">
				<defs>
					<linearGradient id="denver-estrella" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stop-color="#7CCBFF" />
						<stop offset="1" stop-color="#1F6BFF" />
					</linearGradient>
				</defs>
				<path d="M4 39 L21 1 L27 1 L44 39 L36 39 L24 12 L12 39 Z" fill="url(#denver-estrella)" />
				<path d="M0 25 L47 9 L26 22 L31 31 Z" fill="#E6F4FF" />
			</svg>
			<span class="denver-logo__texto">
				<span class="denver-logo__nombre">DENVER</span>
				<span class="denver-logo__rubro">LIBRERIA</span>
			</span>
		</a>
	</div>
	<?php
}

// Franja de campana sobre la cabecera.
add_action(
	'storefront_before_header',
	function () {
		$url = esc_url( 'https://wa.me/' . DENVER_WHATSAPP . '?text=' . rawurlencode( 'Hola DENVER, quiero cotizar regalos de Navidad por mayor.' ) );
		echo '<div class="denver-franja">Campaña Navidad 2026: precios por mayor y menor. <a href="' . $url . '">Cotiza por WhatsApp</a></div>';
	},
	5
);

// Boton flotante de WhatsApp.
add_action(
	'wp_footer',
	function () {
		$url = esc_url( 'https://wa.me/' . DENVER_WHATSAPP . '?text=' . rawurlencode( 'Hola DENVER, quiero hacer una consulta.' ) );
		?>
		<a class="denver-whatsapp" href="<?php echo $url; ?>" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp al <?php echo esc_attr( DENVER_WHATSAPP_VISIBLE ); ?>">
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
			<span>Escríbenos</span>
		</a>
		<?php
	}
);

// Textos del pie con el contacto de la tienda.
add_filter(
	'storefront_credit_link',
	'__return_false'
);
add_filter(
	'storefront_copyright_text',
	function () {
		return '&copy; ' . gmdate( 'Y' ) . ' Importadora y Multiservicios DENVER. WhatsApp ' . DENVER_WHATSAPP_VISIBLE . ' / 902 022 295.';
	}
);
