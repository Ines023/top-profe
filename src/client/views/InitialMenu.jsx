/* eslint-disable max-len */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Modal from './subcomponents/Modal';
import { fetchGet, fetchPost } from '../util';

export default class InitialMenu extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			showStudentModal: false,
			showProfessorModal: false,
			user: {},
			degrees: [],
			degreeId: '',
		};

		this.setUserActive = this.setUserActive.bind(this);
		this.setStudentDegree = this.setStudentDegree.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/user')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
				const { user } = this.state;
				if (user.active) {
					this.setState({
						isLoaded: true,
					});
					return null;
				}
				if (!user.active && user.type === 'student') this.setState({ showStudentModal: true });
				else if (!user.active && user.type === 'professor') this.setState({ showProfessorModal: true });
				else this.setUserActive();
				return null;
			});

		fetchGet('/api/degrees')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					degrees: res,
				});
				const { degrees } = this.state;
				if (degrees) this.setState({ degreeId: degrees[0].id });
			});
	}

	setUserActive() {
		fetchPost('/api/user/activate', {})
			.then(r => r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
					showStudentModal: false,
					showProfessorModal: false,
				});
			});
	}

	setStudentDegree() {
		const { degreeId } = this.state;

		this.setState({
			showStudentModal: false,
		});

		fetchPost('/api/user/degree', { degreeId })
			.then(r => r.json())
			.then(() => {
				this.setUserActive();
			});
	}

	render() {
		const {
			isLoaded, showStudentModal, showProfessorModal, degrees, degreeId, user,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		if (showStudentModal) {
			return (
				<Modal show onClose={() => this.setState({ showStudentModal: false })}>
					<h2>¡Bienvenid@ a Top Profe!</h2>
					<p>Antes de continuar, indícanos la titulación que estás cursando durante este curso académico:</p>
					<div className="big-input search-input box">
						<select onChange={() => this.setState({ degreeId: event.target.value })} value={degreeId}>
							{degrees.map(degree => (
								<option key={degree.id} value={degree.id}>{degree.acronym} ({degree.id})</option>
							))}
						</select>
					</div>
					<br />
					<button type="button" className="box main-button menu-item" onClick={this.setStudentDegree}>
						Confirmar Titulación
					</button>
				</Modal>
			);
		}

		if (showProfessorModal) {
			return (
				<Modal show onClose={() => this.setState({ showProfessorModal: false })}>
					<h2>¡Bienvenid@ a Top Profe!</h2>
					<p>
						Top Profe es una web creada por DAT que permite a los estudiantes calificar a los profesores en función de su experiencia tras recibir sus clases.
						Con esta herramienta pretendemos proporcionar una ayuda extra al resto de estudiantes, así como mejorar la calidad docente de la Escuela.
					</p>
					<p>
						Concretamente, los principales tres objetivos que buscamos ofreciendo este servicio son:
					</p>
					<ul>
						<li>
							Ayudar a los compañeros a decidir qué profesores les pueden interesar más a la hora de ir a clase.
						</li>
						<li>
							Proporcionar una fuente de feedback para aquellos profesores que estén interesados.
						</li>
						<li>
							Contar con un punto en el que poder consultar datos objetivos sobre la calidad de la docencia en nuestra Escuela.
						</li>
					</ul>
					<p>
						Puedes consultar toda la inforamción de esta aplicación <a href="https://dat.etsit.upm.es/servicios/top-profe/">aquí</a>.
					</p>
					<button type="button" className="box main-button menu-item" onClick={this.setUserActive}>
						Entendido
					</button>
				</Modal>
			);
		}

		return (
			<div>
				<div className="box">
					<p>
						Esto es Top Profe, la web de DAT en la que puedes ver las
						valoraciones de tus compañeros de cada profesor, y contribuir
						con tus propias puntuaciones.
					</p>
					<br />
					<p>
						El objetivo de Top Profe es ayudarte a tomar decisiones
						informadas a la hora de escoger profesor para cada asignatura,
						así como mejorar la calidad docente.
					</p>
					<br />
					<p>
						Esperamos que te sea útil ;)
					</p>
					<br />
					<small>
						<i style={{ color: '#FF6555' }}>
							Top Profe no es una herramienta oficial de valoración al basarse en votos emitidos por los alumnos de la ETSIT.
							Delegación de Alumnos de Telecomunicación no se responsabiliza de las valoraciones de los usuarios al tratarse de votaciones anónimas.
						</i>
					</small>
				</div>
				{/* <br />
				<a className="box main-button menu-item" href="/ranking">
					Ranking global
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</a> */}
				<br />
				<a className="box main-button menu-item" href="/subjects">
					Buscar profesores por asignatura
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</a>
				<br />
				<a className="box main-button menu-item" href="/professors">
					Buscar profesores por nombre
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</a>
			</div>
		);
	}
}
