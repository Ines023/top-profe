/* eslint-disable max-len */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


export default function AdminMainView() {
	return (
		<>
			<a className="box main-button menu-item" href="/admin/degrees">
				Editar titulaciones
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
			<br />
			<a className="box main-button menu-item" href="/admin/update/subjects">
				Actualizar asignaturas
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
			<br />
			<a className="box main-button menu-item" href="/admin/subjects">
				Editar asignaturas
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
			<br />
			<a className="box main-button menu-item" href="/admin/update/professors">
				Actualizar profesores
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
			<br />
			<a className="box main-button menu-item" href="/admin/professors">
				Editar profesores
				<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
			</a>
		</>
	);
}
