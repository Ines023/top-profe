import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { fetchGet } from '../util';

export default class ProfessorList extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			professors: [],
			searchKeyword: '',
		};

		this.searchUpdated = this.searchUpdated.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/v1/professors')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					professors: res.professors,
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
		const { isLoaded, professors, searchKeyword } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const filteredProfessors = professors.filter(createFilter(
			searchKeyword, 'name',
		));

		const professorRows = [];
		for (let i = 0; i < filteredProfessors.length; i++) {
			const row = (
				<tr key={i}>
					<td>
						{(filteredProfessors[i].avg) ? i + 1 : '?'}
					</td>
					<td>
						<a href={`/profesores/${filteredProfessors[i].id}`}>
							{filteredProfessors[i].name}
						</a>
					</td>
					<td>
						{(filteredProfessors[i].avg)
							? `${Math.round(filteredProfessors[i].avg * 100) / 100}/5 (total: ${filteredProfessors[i].count})`
							: '-'}
					</td>
				</tr>
			);
			professorRows.push(row);
		}

		return (
			<div>
				<h2>Profesores</h2>
				<SearchInput
					className="big-input search-input box"
					placeholder="Buscar profesor..."
					throttle={0}
					onChange={this.searchUpdated}
				/>
				<br />
				<p className="">
					Puedes entrar en el perfil de cada profesor pulsando en su nombre.
				</p>
				<table className="full-width box">
					<thead>
						<tr>
							<th>#</th>
							<th>Nombre</th>
							<th>Punt. media</th>
						</tr>
					</thead>
					<tbody>
						{ professorRows }
					</tbody>
				</table>
			</div>
		);
	}
}
