import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


export default function InitialMenu() {
	return (
		<div>
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
