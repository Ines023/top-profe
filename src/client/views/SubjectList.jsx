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
		fetchGet('/api/subjects')
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
			searchKeyword, ['acronym', 'name', 'degree'],
		));

		return (
			<div>
				<h2 className="centered">Asignaturas</h2>
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
							<th>Titulación</th>
						</tr>
					</thead>
					<tbody>
						{ filteredSubjects.map(subject => (
							<tr key={subject.id}>
								<td>
									<a href={`/subjects/${subject.acronym}`}>
										{subject.name}
									</a>
								</td>
								<td>
									<a href={`/subjects/${subject.acronym}`}>
										{subject.acronym}
									</a>
								</td>
								<td>
									{subject.degree}
								</td>
							</tr>
						)) }
					</tbody>
				</table>
			</div>
		);
	}
}
