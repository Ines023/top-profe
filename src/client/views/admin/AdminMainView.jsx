/* eslint-disable max-len */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { fetchGet } from '../../util';


export default class AdminMainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoaded: false,
		};
	}

	componentDidMount() {
		fetchGet('/api/admin')
			.then(r => r.json())
			.then(() => {
				this.setState({
					isLoaded: true,
				});
			});
	}

	render() {
		const {
			isLoaded,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<>
				<Link className="box main-button menu-item" to="degrees">
					Editar titulaciones
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</Link>
				<br />
				<Link className="box main-button menu-item" to="update/subjects">
					Actualizar asignaturas
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</Link>
				<br />
				<Link className="box main-button menu-item" to="subjects">
					Editar asignaturas
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</Link>
				<br />
				<Link className="box main-button menu-item" to="update/professors">
					Actualizar profesores
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</Link>
				<br />
				<Link className="box main-button menu-item" to="professors">
					Editar profesores
					<FontAwesomeIcon className="main-button-icon" icon={faArrowRight} />
				</Link>
			</>
		);
	}
}
