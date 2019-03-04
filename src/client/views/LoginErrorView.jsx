import React from 'react';

export default function ErrorView() {
	return (
		<div>
			<h2>Error en el inicio de sesión</h2>
			<p>
				Ugh, parece que ha surgido un problema al iniciar sesión. Eso,
				o probablemente hayan sido aliens.
			</p>
			<p>
				Por favor, inténtalo de nuevo y si el problema persiste
				mándanos un correo a <a href="mailto:dat@sscc.etsit.upm.es">dat@sscc.etsit.upm.es</a>.
			</p>
		</div>
	);
}
