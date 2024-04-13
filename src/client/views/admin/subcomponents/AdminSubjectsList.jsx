/* eslint-disable max-len */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';

export default class AdminSubjectsList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchKeyword: '',
		};

		this.searchUpdated = this.searchUpdated.bind(this);
	}


	searchUpdated(searchKeyword) {
		this.setState({
			// Remove accents from the search keywords.
			searchKeyword: searchKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		});
	}

	render() {
		const {
			searchKeyword,
		} = this.state;

		const { subjects, degree, description } = this.props;

		const filteredDegrees = subjects.filter(createFilter(
			searchKeyword, ['nombre', 'codigo'],
		));

		return (
			<>
				<div>
					<h2 className="centered">Asignaturas {degree.acronym}</h2>
					<SearchInput
						className="big-input search-input box"
						placeholder="Buscar asignatura..."
						throttle={0}
						onChange={this.searchUpdated}
					/>
					<br />
					<p className="">
						{description}
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
								<tr key={subject.codigo || subject.id}>
									<td>
										<p>
											{subject.codigo || subject.id}
										</p>
									</td>
									<td>
										<p>
											{subject.nombre || subject.name}
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
