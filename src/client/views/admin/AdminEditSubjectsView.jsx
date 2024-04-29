/* eslint-disable max-len */
import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

import { fetchGet } from '../../util';
import AdminSubjectsList from './subcomponents/AdminSubjectsList';

function AdminEditSubjectsView(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class AdminEditSubjectsViewClass extends Component {
	constructor(props) {
		super(props);
		const { params: { degreeId } } = this.props;

		this.state = {
			isLoaded: false,
			subjects: {},
			degree: {},
		};

		this.degreeId = degreeId;
	}

	componentDidMount() {
		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/subjects/${this.degreeId}`)
			.then(r => (r?.status === 200) && r.json())
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

export default AdminEditSubjectsView(AdminEditSubjectsViewClass);
