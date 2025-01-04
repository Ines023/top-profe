/* eslint-disable max-len */
import React, { Component } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../subcomponents/Modal';
import { fetchGet, fetchPost } from '../../util';
import AdminSubjectsList from './subcomponents/AdminSubjectsList';
import toast from 'react-hot-toast';

function AdminUpdateSubjectsView(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class AdminUpdateSubjectsViewClass extends Component {
	constructor(props) {
		super(props);
		const { params: { degreeId } } = this.props;


		this.state = {
			isLoaded: false,
			isSaved: false,
			subjects: {},
			degree: {},
			showConfirmation: false,
		};

		this.degreeId = degreeId;
		this.saveSubjects = this.saveSubjects.bind(this);
	}

	componentDidMount() {
		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/update/subjects/${this.degreeId}`)
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subjects: res,
				});
			});
	}

	saveSubjects(subjects) {
		const loadingToast = toast.loading('Importando asignaturas...');
		this.setState({
			showConfirmation: false,
			isLoaded: false,
		});

		fetchPost(`/api/admin/update/subjects/${this.degreeId}`, {
			missingSubjects: subjects,
		})
			.then(r => (r?.status ===200) && r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
					isSaved: true,
				});
				toast.success('Asignaturas importadas', { id: loadingToast });
			});
	}

	render() {
		const {
			isLoaded, isSaved, subjects, degree, showConfirmation,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);
		if (isSaved) return (<Navigate to={`/admin/subjects/${degree.id}`} />);

		return (
			<>
				<h1 className="centered">Actualizar asignaturas</h1>

				{subjects.length > 0 ? (
					<>
						<AdminSubjectsList subjects={subjects} degree={degree} description={`Aquí se muestra un listado de todas las asignaturas de la titulación ${degree.id} que no figuran en la base de datos.`} />
						<br />
						<button type="button" className="box main-button menu-item" onClick={() => this.setState({ showConfirmation: true })}>
							Añadir asignaturas
							<FontAwesomeIcon className="main-button-icon" icon={faPlus} />
						</button>
						<Modal show={showConfirmation} allowClose onClose={() => this.setState({ showConfirmation: false })}>
							<h2>¿Estás seguro de que quieres añadir estas asignaturas?</h2>
							<p>Una vez realizada la importación, no es posible revertir el proceso. Asegúrate de que cuentas con una copia de seguridad de la base de datos.</p>
							<button type="button" className="box main-button menu-item" onClick={() => this.saveSubjects(subjects)}>
								Importar asignaturas
							</button>
						</Modal>
					</>
				)
					: <h2 className="centered">No hay nuevas asignaturas disponibles para {degree.acronym}</h2>}

			</>
		);
	}
}

export default AdminUpdateSubjectsView(AdminUpdateSubjectsViewClass);
