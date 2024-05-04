import React from 'react';

export default function UserRow({ user, degrees, updateUser }) {
	const handleTypeChange = (event) => {
		updateUser(user, 'type', event.target.value);
	};

	const handleDegreeChange = (event) => {
		updateUser(user, 'degreeId', event.target.value);
	};

	const handleActiveChange = (event) => {
		updateUser(user, 'active', event.target.value);
	};

	const handleAdminChange = (event) => {
		updateUser(user, 'admin', event.target.value);
	};

	const handleExcludedChange = (event) => {
		updateUser(user, 'excluded', event.target.value);
	};

	return (
		<tr>
			<td>
				{user.id}
			</td>
			<td>
				<div className="big-input search-input box table-select type long">
					<select onChange={handleTypeChange} value={user.type}>
						<option value="student">Estudiante</option>
						<option value="professor">Profesor</option>
						<option value="other">Otro</option>
					</select>
				</div>
			</td>
			<td>
				<div className="big-input search-input box table-select long">
					<select onChange={handleDegreeChange} value={user.degreeId}>
						<option key="null" value="">NULL</option>
						{degrees.map(degree => (
							<option key={degree.id} value={degree.id}>{degree.acronym}</option>
						))}
					</select>
				</div>
			</td>
			<td>
				<div className="big-input search-input box table-select">
					<select onChange={handleActiveChange} value={user.active}>
						<option value="1">Sí</option>
						<option value="0">No</option>
					</select>
				</div>
			</td>
			<td>
				<div className="big-input search-input box table-select">
					<select onChange={handleAdminChange} value={user.admin}>
						<option value="1">Sí</option>
						<option value="0">No</option>
					</select>
				</div>
			</td>
			<td>
				<div className="big-input search-input box table-select">
					<select onChange={handleExcludedChange} value={user.excluded}>
						<option value="1">Sí</option>
						<option value="0">No</option>
					</select>
				</div>
			</td>
		</tr>
	);
}
