import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ErrorView(props) {
	const { code } = props;
	const { pathname } = useLocation();

	let content;

	switch (code) {
	case 403:
		content = (
			<div>
				<h3>
					Tu usuario se ha dado de baja
				</h3>
				<p>
					Tu acceso a la aplicación se encuentra bloqueado. Si deseas restaurar tu acceso, puedes escribirnos a <a href="mailto:da.etsit@upm.es">da.etsit@upm.es</a>.
				</p>
			</div>
		);
		break;

	case 404:
		content = (
			<div>
				<h3>
					Errrhhh... ¿Cómo has llegado aquí?
				</h3>
				<p>
					La página que has pedido
					(<span className="monospaced">{pathname}</span>) no existe.
				</p>
			</div>
		);
		break;
	default:
		content = (
			<div>
				<h3>
					Ouch. Top Profe no se encuentra muy bien...
				</h3>
				<p>
					Ha habido un problema inesperado al atender tu petición.
					Por favor, avísanos para que podamos arreglarlo enviando un
					correo a <a href="mailto:infraestructuras.da.etsit@upm.es">infraestructuras.da.etsit@upm.es</a>.
				</p>
			</div>
		);
		break;
	}

	return (
		<div>
			<h2>{code}</h2>
			{content}
		</div>
	);
}
