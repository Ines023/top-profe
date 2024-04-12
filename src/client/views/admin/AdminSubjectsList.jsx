/* eslint-disable max-len */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchGet } from '../../util';

export default class AdminSubjectsList extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { degreeId } } = match;

		this.state = {
			isLoaded: false,
			subjects: {},
			searchKeyword: '',
		};

		this.degreeId = degreeId;

		this.searchUpdated = this.searchUpdated.bind(this);
	}

	componentDidMount() {
		fetchGet(`/api/admin/update/${this.degreeId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subjects: res,
				});
			});
	}

	searchUpdated(searchKeyword) {
		this.setState({
			// Remove accents from the search keywords.
			searchKeyword: searchKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		});
	}

	render() {
		const { isLoaded, subjects, searchKeyword } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const filteredDegrees = subjects.filter(createFilter(
			searchKeyword, ['nombre', 'codigo'],
		));

		return (
			<>
				<div>
					<h2 className="centered">Asignaturas {this.degreeId}</h2>
					<SearchInput
						className="big-input search-input box"
						placeholder="Buscar asignatura..."
						throttle={0}
						onChange={this.searchUpdated}
					/>
					<br />
					<p className="">
						Aquí se muestra un listado de todas las asignaturas de la titulación {this.degreeId} que no figuran en la base de datos.
					</p>
					<table className="full-width box">
						<thead>
							<tr>
								<th>Código</th>
								<th>Nombre</th>
							</tr>
						</thead>
						<tbody>
							{filteredDegrees.map(subject => (
								<tr key={subject.codigo}>
									<td>
										<p>
											{subject.codigo}
										</p>
									</td>
									<td>
										<p>
											{subject.nombre}
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<br />
				<button type="button" className="box main-button menu-item" onClick={this.componentDidMount}>
					Añadir asignaturas
					<FontAwesomeIcon className="main-button-icon" icon={faPlus} />
				</button>
			</>
		);
	}
}
