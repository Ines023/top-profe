import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { fetchGet } from '../util';

export default class SubjectList extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			subjects: [],
			searchKeyword: '',
		};

		this.searchUpdated = this.searchUpdated.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/v1/subjects')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subjects: res.subjects,
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
		const { isLoaded, searchKeyword, subjects } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const filteredSubjects = subjects.filter(createFilter(
			searchKeyword, ['acronym', 'name'],
		));

		const subjectRows = [];
		for (let i = 0; i < filteredSubjects.length; i++) {
			const row = (
				<tr key={i}>
					<td>
						<a href={`/asignaturas/${filteredSubjects[i].acronym}`}>
							{filteredSubjects[i].name}
						</a>
					</td>
					<td>
						<a href={`/asignaturas/${filteredSubjects[i].acronym}`}>
							{filteredSubjects[i].acronym}
						</a>
					</td>
				</tr>
			);
			subjectRows.push(row);
		}

		return (
			<div>
				<h2>Asignaturas</h2>
				<SearchInput className="big-input search-input box" placeholder="Buscar asignatura..." throttle={0} onChange={this.searchUpdated} />
				<br />
				<p>
					Puedes ver los detalles de cada asignatura pulsando en su nombre.
				</p>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Siglas</th>
						</tr>
					</thead>
					<tbody>
						{ subjectRows }
					</tbody>
				</table>
			</div>
		);
	}
}
