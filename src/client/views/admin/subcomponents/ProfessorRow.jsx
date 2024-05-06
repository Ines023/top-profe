import React from 'react';

export default function ProfessorRow({ professor, updateProfessor }) {
	const handleStatusChange = (event) => {
		updateProfessor(professor, 'status', event.target.value);
	};

	return (
		<tr>
			<td>
				{professor.id}
			</td>
			<td>
				{professor.name}
			</td>
			<td>
				<div className="big-input search-input box table-select type long">
					<select onChange={handleStatusChange} value={professor.status}>
						<option value="active">Activo</option>
						<option value="excluded">Excluído</option>
						<option value="retired">Jubilado</option>
					</select>
				</div>
			</td>
		</tr>
	);
}
