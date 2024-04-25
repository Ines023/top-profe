/* eslint-disable no-nested-ternary */
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
		fetchGet('/api/professors')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					professors: res,
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

		return (
			<div>
				<h2 className="centered">Profesores</h2>
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
							<th>Nombre</th>
							<th>Punt. media</th>
						</tr>
					</thead>
					<tbody>
						{ filteredProfessors.map(professor => (
							<tr key={professor.hash}>
								<td>
									<a href={`/professors/${professor.hash}`} className={professor.status}>
										{professor.name}
									</a>
								</td>
								<td className={professor.status}>
									{professor.status === 'excluded' ? 'OCULTO' : professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						)) }
					</tbody>
				</table>
			</div>
		);
	}
}
