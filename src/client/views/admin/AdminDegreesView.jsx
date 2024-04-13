import React from 'react';
import AdminDegreesList from './subcomponents/AdminDegreesList';


export default function AdminDegreesView({
	subjects = null, professors = null, updateSubjects = null, updateProfessors = null,
}) {
	const nextView = (subjects && '/admin/subjects') || (professors && '/admin/professors') || (updateSubjects && '/admin/update/subjects') || (updateProfessors && '/admin/update/professors') || (true && '/admin/degrees');

	const title = (subjects && 'Editar asignaturas') || (professors && 'Editar profesores') || (updateSubjects && 'Actualizar asignaturas') || (updateProfessors && 'Actualizar profesores') || (true && 'Editar titulaciones');

	return (
		<>
			<h1 className="centered">{title}</h1>
			<AdminDegreesList nextView={nextView} />
		</>
	);
}
