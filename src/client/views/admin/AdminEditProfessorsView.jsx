/* eslint-disable max-len */
import React, { Component } from 'react';
import AdminProfessorsList from './subcomponents/AdminProfessorsList';
import { fetchGet } from '../../util';

export default class AdminEditProfessorsView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoaded: false,
			professors: {},
		};
	}

	componentDidMount() {
		fetchGet('/api/admin/professors')
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					professors: res,
					isLoaded: true,
				});
			});
	}

	render() {
		const {
			isLoaded, professors,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		console.log(professors);

		return (
			<>
				<h1 className="centered">Editar profesores</h1>
				{professors.length > 0 ? <AdminProfessorsList professors={professors} description="Aquí se muestra un listado de todos los profesores." />
					: <h2 className="centered">No hay profesores cargdos</h2>
				}
			</>
		);
	}
}
