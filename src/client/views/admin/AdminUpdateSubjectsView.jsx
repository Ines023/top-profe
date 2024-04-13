/* eslint-disable max-len */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../subcomponents/Modal';
import { fetchGet, fetchPost } from '../../util';
import AdminSubjectsList from './subcomponents/AdminSubjectsList';

export default class AdminUpdateSubjectsView extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { degreeId } } = match;

		this.state = {
			isLoaded: false,
			subjects: {},
			degree: {},
			showConfirmation: false,
		};

		this.degreeId = degreeId;

		this.saveSubjects = this.saveSubjects.bind(this);
	}

	componentDidMount() {
		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/update/subjects/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subjects: res,
				});
			});
	}

	saveSubjects(subjects) {
		fetchPost(`/api/admin/update/subjects/${this.degreeId}`, {
			missingSubjects: subjects,
		})
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
			isLoaded, subjects, degree, showConfirmation,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<>
				<AdminSubjectsList subjects={subjects} degree={degree} description={`Aquí se muestra un listado de todas las asignaturas de la titulación ${degree.id} que no figuran en la base de datos.`} />
				<br />
				<button type="button" className="box main-button menu-item" onClick={() => this.setState({ showConfirmation: true })}>
					Añadir asignaturas
					<FontAwesomeIcon className="main-button-icon" icon={faPlus} />
				</button>
				<Modal show={showConfirmation} onClose={() => this.setState({ showConfirmation: false })}>
					<h2>¿Estás seguro de que quieres añadir estas asignaturas?</h2>
					<p>Una vez realizada la importación, no es posible revertir el proceso. Asegúrate de que cuentas con una copia de seguridad de la base de datos.</p>
					<button type="button" className="box main-button menu-item" onClick={() => this.saveSubjects(subjects)}>
						Importar asignaturas
					</button>
				</Modal>

			</>
		);
	}
}
