/* eslint-disable max-len */
import React from 'react';
import AdminProfessorsList from './subcomponents/AdminProfessorsList';

export default function AdminEditProfessorsView() {
	return (
		<>
			<h1 className="centered">Editar profesores</h1>
			<AdminProfessorsList description="Aquí se muestra un listado de todos los profesores." />
		</>
	);
}
