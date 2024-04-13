import React from 'react';
import AdminDegreesList from './AdminDegreesList';


export default function AdminDegreesView({
	subjects = null, professors = null, updateSubjects = null, updateProfessors = null,
}) {
	const nextView = (subjects && '/admin/subjects') || (professors && '/admin/professors') || (updateSubjects && '/admin/update/subjects') || (updateProfessors && '/admin/update/professors') || (true && '/admin/degrees');

	return (
		<>
			<AdminDegreesList nextView={nextView} />
		</>
	);
}
