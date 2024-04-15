/* eslint-disable max-len */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';

export default class AdminProfessorsSubjectsList extends Component {
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

		const { professors, degree, description } = this.props;

		const filteredDegrees = professors.filter(createFilter(
			searchKeyword, ['subjectId', 'name'],
		));

		return (
			<>
				<div>
					<h2 className="centered">Profesores {degree.acronym}</h2>
					<SearchInput
						className="big-input search-input box"
						placeholder="Buscar profesor..."
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
								<th>Nombre</th>
								<th>Asignatura(s)</th>
							</tr>
						</thead>
						<tbody>
							{filteredDegrees.map(professor => (
								<tr key={professor.id}>
									<td>
										<p>
											{professor.name}
										</p>
									</td>
									<td>
										<p>
											{professor.subjectId.toString()}
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
