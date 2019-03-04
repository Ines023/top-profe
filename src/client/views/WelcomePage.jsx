import React from 'react';

export default function WelcomePage() {
	return (
		<div>
			<div className="box">
				<p>
					Esto es Top Profe, la web de DAT en la que puedes ver las
					valoraciones de tus compañeros de cada profesor, y contribuir
					con tus propias puntuaciones.
				</p>
				<br />
				<p>
					El objetivo de Top Profe es ayudarte a tomar decisiones
					informadas a la hora de escoger profesor para cada asignatura,
					así como mejorar la calidad docente.
				</p>
			</div>
			<br />
			<a className="centered box main-button menu-item" href="/">
				Acceder
			</a>
		</div>
	);
}
