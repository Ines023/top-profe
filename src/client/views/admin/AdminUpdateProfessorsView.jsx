/* eslint-disable max-len */
import React, { Component } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import Modal from '../subcomponents/Modal';
// eslint-disable-next-line no-unused-vars
import { fetchGet, fetchPost } from '../../util';
import AdminProfessorsSubjectsList from './subcomponents/AdminProfessorsSubjectsList';
import toast from 'react-hot-toast';

function AdminUpdateProfessorsView(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class AdminUpdateProfessorsViewClass extends Component {
	constructor(props) {
		super(props);
		const { params: { degreeId } } = this.props;

		this.state = {
			isLoaded: false,
			isSaved: false,
			degree: {},
			professors: {},
			missingGuides: [],
			askYear: true,
			academicYear: '',
			showError: false,
			showConfirmation: false,
		};

		this.degreeId = degreeId;

		this.fetchProfessors = this.fetchProfessors.bind(this);
		this.saveProfessors = this.saveProfessors.bind(this);
		this.exportToCSV = this.exportToCSV.bind(this);

	}

	fetchProfessors() {
		const { academicYear } = this.state;

		const loadingToast = toast.loading('Recuperando profesores...');
		this.setState({
			askYear: false,
			isLoaded: false,
		});

		const re = /^\d{4}-\d{2}$/;
		if (!re.test(academicYear)) {
			this.setState({
				showError: true,
			});
			return;
		}

		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});

		fetchGet(`/api/admin/update/professors/${this.degreeId}/${academicYear}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					askYear: false,
					isLoaded: true,
					professors: res.newProfessors,
					missingGuides: res.missingGuides
				});
				toast.success('Profesores cargados.', { id: loadingToast });
			});
	}

	saveProfessors(professors) {
		const { academicYear } = this.state;
		const loadingToast = toast.loading('Importando asignaturas...');

		this.setState({
			showConfirmation: false,
			isLoaded: false,
		});

		fetchPost(`/api/admin/update/professors/${this.degreeId}/${academicYear}`, {
			missingProfessors: professors,
		})
			.then(r => (r?.status === 200) && r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
					isSaved: true,
				});
				toast.success('Profesores importados.', { id: loadingToast });
			});
	}

	exportToCSV() {
		const { missingGuides, academicYear } = this.state;

		const fieldNames = ['code', 'semester', 'name', 'year']

		const header = fieldNames.join(',') + '\n';

		// Convertir el array de objetos a formato CSV
		const csvContent = missingGuides.map(row => Object.values(row).join(',')).join('\n');

		const url = URL.createObjectURL(new Blob([header, csvContent], { type: 'text/csv' }))

		// Crear un enlace para descargar el archivo
		const link = document.createElement('a');
		link.href = url;
		link.download = `missingGuides_${this.degreeId}_${academicYear}.csv`;

		document.body.appendChild(link);

		link.click();

		link.parentNode.removeChild(link);
	}


	render() {
		const {
			isLoaded, isSaved, professors, missingGuides, degree, askYear, academicYear, showError, showConfirmation,
		} = this.state;

		const showErrorClassName = showError ? 'error display-block' : 'error display-none';

		if (askYear) {
			return (
				<Modal show onClose={() => this.setState({ askYear: false })}>
					<h2>Indica el curso académico para realizar la búsqueda</h2>
					<div className="big-input search-input box">
						<input
							type="text"
							placeholder="Curso académico en formato 20XX-YY"
							value={academicYear}
							// eslint-disable-next-line no-restricted-globals
							onChange={() => this.setState({ academicYear: event.target.value })}
						/>
					</div>
					<br />
					<p className={showErrorClassName}>El curso académico introducido no es válido.</p>
					<button type="button" className="box main-button menu-item" onClick={this.fetchProfessors}>
						Iniciar búsqueda
					</button>
					<br />
					<br />
					<a className="box main-button menu-item" href={`/admin/update/professors/${this.degreeId}/upload`} >
						Importar desde archivo
						<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
					</a>
				</Modal>
			);
		}

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);
		if (isSaved) return (<Navigate to="/admin/professors" />);

		return (
			<>
				{missingGuides.length > 0 &&
					<>
					<a type="button" className="box main-button menu-item" href='#' onClick={this.exportToCSV}>
						Descargar listado de guías no encontradas
						<FontAwesomeIcon className="main-button-icon" icon={faDownload} />
					</a>
					<br />
					</>}

				<h1 className="centered">Actualizar profesores</h1>

				{professors ? (
					<>
						<AdminProfessorsSubjectsList professors={Object.values(professors)} degree={degree} description={`Aquí se muestra un listado de todos los profesores de la titulación ${degree.id} que no figuran en la base de datos.`} />
						<br />
						<button type="button" className="box main-button menu-item" onClick={() => this.setState({ showConfirmation: true })}>
							Añadir profesores
							<FontAwesomeIcon className="main-button-icon" icon={faPlus} />
						</button>
						<Modal show={showConfirmation} allowClose onClose={() => this.setState({ showConfirmation: false })}>
							<h2>¿Estás seguro de que quieres importar estos profesores?</h2>
							<p>Una vez realizada la importación, no es posible revertir el proceso. Asegúrate de que cuentas con una copia de seguridad de la base de datos.</p>
							<button type="button" className="box main-button menu-item" onClick={() => this.saveProfessors(professors)}>
								Importar Profesores
							</button>
						</Modal>
					</>
				)
					: <h2 className="centered">No hay nuevos profesores disponibles para {degree.acronym}</h2>}

			</>
		);
	}
}

export default AdminUpdateProfessorsView(AdminUpdateProfessorsViewClass);
