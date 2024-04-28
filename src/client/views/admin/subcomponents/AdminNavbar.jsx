/* eslint-disable max-len */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { fetchGet } from '../../../util';


export default class AdminNavbar extends Component {
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

		return (
			<>
				{isLoaded && (
					<nav>
						<ul className="navbar">
							<li><Link to="/admin">Inicio</Link></li>
							<li>
								<a href="#">Editar</a>
								<ul className="subnav">
									<li><Link to="/admin/degrees">Titulaciones</Link></li>
									<li><Link to="/admin/subjects">Asignaturas</Link></li>
									<li><Link to="/admin/professors">Profesores</Link></li>
								</ul>
							</li>
							<li>
								<a href="#">Actualizar</a>
								<ul className="subnav">
									<li><Link to="/admin/update/subjects">Asignaturas</Link></li>
									<li><Link to="/admin/update/professors">Profesores</Link></li>
								</ul>
							</li>
						</ul>
					</nav>
				)}
			</>
		);
	}
}
