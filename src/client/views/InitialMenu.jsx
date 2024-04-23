/* eslint-disable max-len */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


export default function InitialMenu() {
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
				<br />
				<p>
					Esperamos que te sea útil ;)
				</p>
				<br />
				<small>
					<i style={{ color: '#FF6555' }}>
						Top Profe no es una herramienta oficial de valoración al basarse en votos emitidos por los alumnos de la ETSIT.
						Delegación de Alumnos de Telecomunicación no se responsabiliza de las valoraciones de los usuarios al tratarse de votaciones anónimas.
					</i>
				</small>
			</div>
			{/* <br />
			<a className="box main-button menu-item" href="/ranking">
				Ranking global
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a> */}
			<br />
			<a className="box main-button menu-item" href="/asignaturas">
				Buscar profesores por asignatura
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
			<br />
			<a className="box main-button menu-item" href="/profesores">
				Buscar profesores por nombre
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
		</div>
	);
}
