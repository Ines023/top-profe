/* eslint-disable max-len */
import React from 'react';
import AdminDegreesList from './AdminDegreesList';


export default function AdminUpdater({ subjects = null, professors = null }) {
	return (
		<>
			{(subjects && <AdminDegreesList isSubjectsUpdater />) || (professors && <AdminDegreesList isProfessorsUpdater />) || <AdminDegreesList />}
		</>
	);
}
