/* eslint-disable max-len */
import React, { Component } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../subcomponents/Modal';
import { fetchGet, fetchPost } from '../../util';
import AdminProfessorsSubjectsList from './subcomponents/AdminProfessorsSubjectsList';
import toast from 'react-hot-toast';

function AdminUploadProfessorsView(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class AdminUploadProfessorsViewClass extends Component {
	constructor(props) {
		super(props);
		const { params: { degreeId } } = this.props;

		this.state = {
			isLoaded: false,
			isSaved: false,
			professors: {},
			askForFile: true,
			academicYear: '',
			professorsFile: null,
			showYearError: false,
			showFileError: false,
			showConfirmation: false,
		};

		this.degreeId = degreeId;

		this.handleFileChange = this.handleFileChange.bind(this);
		this.importProfessors = this.importProfessors.bind(this);
		this.saveProfessors = this.saveProfessors.bind(this);
	}

	componentDidMount() {
		fetchGet(`/api/admin/degrees/${this.degreeId}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					degree: res,
				});
			});
	}

	handleFileChange(event) {
		const file = event.target.files[0];
		
		if (file.type !== "application/json") {
		  toast.error('El archivo no es de tipo JSON.');
		  return;
		}

		const loadingToast = toast.loading('Leyendo fichero...');
		
		const reader = new FileReader();
		
		reader.onload = (e) => {
		  try {
			const jsonContent = JSON.parse(e.target.result);
			this.setState({ professorsFile: jsonContent });
			
		  } catch (error) {
			toast.dismiss(loadingToast);
			toast.error("Error al analizar el contenido del archivo JSON");
		  }
		};
		
		reader.readAsText(file)
		toast.dismiss(loadingToast);
	  }
	  

	importProfessors() {
		const { academicYear, professorsFile, professors } = this.state;

		var professorIds = [];

		const re = /^\d{4}-\d{2}$/;
		if (!re.test(academicYear)) {
			this.setState({
				showYearError: true,
			});
			return;
		}

		professorsFile.forEach((subject) => {
			subject.professors.forEach((professor) => {
				if (!professorIds.find(id => id === professor.id)) {
					professorIds.push(professor.id);
					professors[professor.id] = {
						'id': professor.id,
						'name': professor.name,
						'email': professor.email,
						'subjectId': [subject.subject_code]
					}
				} else {
					professors[professor.id].subjectId.push(subject.subject_code);
				}
			})
		})

		this.setState({
			askForFile: false,
			isLoaded: true,
		});
	}

	saveProfessors() {
		const { professors, academicYear } = this.state;

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
			});
	}

	render() {
		const {
			isLoaded, isSaved, degree, professors, academicYear, askForFile, showYearError, showFileError, showConfirmation,
		} = this.state;

		const showYearErrorClassName = showYearError ? 'error display-block' : 'error display-none';
		const showFileErrorClassName = showFileError ? 'error display-block' : 'error display-none';


		if (askForFile) {
			return (
				<Modal show onClose={() => this.setState({ askForFile: false })}>
					<h2>Indica el curso académico para realizar la búsqueda</h2>
					<div className="big-input search-input box">
						<input
							type="text"
							placeholder="Curso académico en formato 20XX-YY"
							value={academicYear}
							required
							onChange={(e) => this.setState({ academicYear: e.target.value })}
						/>
					</div>
					<br />
					<p className={showYearErrorClassName}>El curso académico introducido no es válido.</p>
					<br />
					<h2>Selecciona el fichero desde el que importar los profesores</h2>
					<div className="big-input search-input box">
						<input type="file" required onChange={(e) => this.handleFileChange(e)} />
					</div>
					<br />
					<p className={showFileErrorClassName}>El fichero no tiene un formato válido.</p>
					<button type="button" className="box main-button menu-item" onClick={this.importProfessors}>
						Iniciar importación
					</button>
				</Modal>
			);
		}

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);
		if (isSaved) return (<Navigate to="/admin/professors" />);

		return (
			<>
				<h1 className="centered">Actualizar profesores</h1>

				{professors ? (
					<>
						<AdminProfessorsSubjectsList professors={Object.values(professors)} degree={degree} description={`Aquí se muestra un listado de todos los profesores de la titulación ${this.degreeId} que no figuran en la base de datos.`} />
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
					: <h2 className="centered">No se han importado nuevos profesores para {degree.acronym}</h2>}

			</>
		);
	}
}

export default AdminUploadProfessorsView(AdminUploadProfessorsViewClass);
