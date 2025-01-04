/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Modal from './subcomponents/Modal';
import { fetchGet, fetchPost } from '../util';
const config = require('../../server/config.json');

export default class InitialMenu extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			showStudentModal: false,
			showFirstTimeModal: false,
			showOptOut: false,
			user: {},
			degrees: [],
			degreeId: '',
			votes: 0,
		};

		this.setUserActive = this.setUserActive.bind(this);
		this.setStudentDegree = this.setStudentDegree.bind(this);
		this.setOptOut = this.setOptOut.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/user')
			.then(r => (r?.status === 200) && r.json())
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
				if (!user.active) this.setState({ showFirstTimeModal: true });
				if (!user.active && user.type === 'student') this.setState({ showStudentModal: true });
				return null;
			});

		fetchGet('/api/degrees')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					degrees: res,
				});
				const { degrees } = this.state;
				if (degrees) this.setState({ degreeId: degrees[0].id });
			});

		fetchGet('/api/votes')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				res && this.setState({ votes: res.votes });
			});
	}

	setUserActive() {
		fetchPost('/api/user/activate', {})
			.then(r => (r?.status === 200) && r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
					showStudentModal: false,
					showFirstTimeModal: false,
				});
			});
	}

	setStudentDegree() {
		const { degreeId } = this.state;

		this.setState({
			showStudentModal: false,
		});

		fetchPost('/api/user/degree', { degreeId })
			.then(r => (r?.status === 200) ? r.json() : this.componentDidMount())
			.then(() => {
			});
	}

	setOptOut() {
		this.setState({
			showOptOut: false,
		});

		fetchPost('/api/opt-out', {})
			.then(r => (r?.status === 200) && r.json());
	}

	render() {
		const {
			isLoaded, showStudentModal, showFirstTimeModal, showOptOut, degrees, degreeId, user, votes,
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
					<small>
						Al seleccionar una titulación, afirmas que te encuentras matriculado en la misma durante el curso académico.
						Las votaciones emitidas harán referencia a la labor docente de los profesores durante el transcurso del mismo, a fin de constatar la evolución de su enseñanza.
						Delegación de Alumnos de Telecomunicación se reserva el derecho a limitar o bloquear el acceso a esta aplicación en caso de detección de comportamientos fraudulentos.
					</small>
					<br />
					<br />
					<button type="button" className="box main-button menu-item" onClick={this.setStudentDegree}>
						Confirmar Titulación
					</button>
				</Modal>
			);
		}

		if (showFirstTimeModal) {
			return (
				<Modal show onClose={() => this.setState({ showFirstTimeModal: false })}>
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
					<small>
						Top Profe no es una herramienta oficial de valoración al basarse en votos emitidos por los alumnos de la ETSIT.
						Delegación de Alumnos de Telecomunicación no se responsabiliza de las valoraciones de los usuarios al tratarse de votaciones anónimas.
					</small>
					<p>
						Puedes consultar toda la información de esta aplicación <a href="https://dat.etsit.upm.es/servicios/top-profe/">aquí</a>.
					</p>
					<button type="button" className="box main-button menu-item" onClick={this.setUserActive}>
						Entendido
					</button>
				</Modal>
			);
		}

		if (showOptOut) {
			return (
				<Modal show allowClose onClose={() => this.setState({ showOptOut: false })}>
					<h2>¿Estás segur@ de que quieres ocultar tus valoraciones?</h2>
					<p>
						Ocultar tus valoraciones no impedirá que continúen emitiéndose votos para las asignaturas que impartes. Delegación de Alumnos de Telecomunicación utiliza estas valoraciones para poder emitir informes de méritos docentes cuando Rectorado solicita dicha información.
					</p>
					<p>
						Al ocultar tus valoraciones, también renuncias a la posibilidad de recibir premios y menciones por tu actividad docente. Puedes revertir esta opción en cualquier momento mediante correo electrónico a <a href="mailto:da.etsit@upm.es">da.etsit@upm.es</a>.
					</p>
					<small>
						Top Profe no es una herramienta oficial de valoración al basarse en votos emitidos por los alumnos de la ETSIT.
						Delegación de Alumnos de Telecomunicación no se responsabiliza de las valoraciones de los usuarios al tratarse de votaciones anónimas.
					</small>
					<br />
					<br />
					<button type="button" className="box main-button menu-item" onClick={this.setOptOut}>
						Estoy de acuerdo
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
					<div className="centered">
						<p>Votos en el curso {config.server.currentAcademicYear}: <strong>{votes}</strong></p>
					</div>
				</div>
				<br />
				<a className="box main-button menu-item" href="/ranking">
					Ranking {config.server.currentAcademicYear}
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</a>
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
				{user.type === 'professor' && (
					<>
						<br />
						<a className="box main-button menu-item" href="#" onClick={() => this.setState({ showOptOut: true })}>
							Ocultar mis valoraciones
							<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
						</a>
					</>
				)}
			</div>
		);
	}
}
