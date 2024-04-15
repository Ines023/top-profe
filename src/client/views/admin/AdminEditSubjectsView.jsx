/* eslint-disable max-len */
import React, { Component } from 'react';

import { fetchGet } from '../../util';
import AdminSubjectsList from './subcomponents/AdminSubjectsList';

export default class AdminEditSubjectsView extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { degreeId } } = match;

		this.state = {
			isLoaded: false,
			subjects: {},
			degree: {},
		};

		this.degreeId = degreeId;
	}

	componentDidMount() {
		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/subjects/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subjects: res,
				});
			});
	}

	render() {
		const {
			isLoaded, subjects, degree,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<>
				<h1 className="centered">Editar asignaturas</h1>
				{subjects.length > 0 ? <AdminSubjectsList subjects={subjects} degree={degree} description={`Aquí se muestra un listado de todas las asignaturas de la titulación ${degree.id}.`} />
					: <h2 className="centered">No hay asignaturas cargadas en {degree.acronym}</h2>
				}
			</>
		);
	}
}
