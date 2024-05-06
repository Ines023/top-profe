/* eslint-disable max-len */
import React from 'react';
import AdminUsersList from './subcomponents/AdminUsersList';

export default function AdminEditUsersView() {
	return (
		<>
			<h1 className="centered">Editar usuarios</h1>
			<AdminUsersList description="Aquí se muestra un listado de todos los usuarios." />
		</>
	);
}
