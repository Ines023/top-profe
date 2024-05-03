import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { fetchGet } from '../util';

export default class SubjectList extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			subjects: [],
			searchKeyword: '',
			sortConfig: {
				key: 'name',
				direction: 'ascending',
			},
			selectedDegree: '',
		};

		this.searchUpdated = this.searchUpdated.bind(this);
		this.handleDegreeChange = this.handleDegreeChange.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/subjects')
			.then(r => (r?.status === 200) && r.json())
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

	sortBy = (key) => {
		let { sortConfig } = this.state;
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		sortConfig = { key, direction };
		this.setState({ sortConfig });
	};

	handleDegreeChange(event) {
		const selectedDegree = event.target.value;
		this.setState({ selectedDegree });
	}

	render() {
		const { isLoaded, searchKeyword, subjects, sortConfig, selectedDegree } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		let filteredSubjects = subjects.filter(createFilter(
			searchKeyword, ['name', 'acronym', 'degree.acronym'], {accentSensitive: true}
		));

		if (selectedDegree) {
			filteredSubjects = filteredSubjects.filter(subject => subject.degree.acronym === selectedDegree);
		}

		let sortedSubjects = [...filteredSubjects];
		if (sortConfig.key) {
			sortedSubjects.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}

		const uniqueDegrees = [...new Set(subjects.map(subject => subject.degree.acronym))];

		return (
			<div>
				<h2 className="centered">Asignaturas</h2>
				<div className="filter-section">
					<label htmlFor="degreeFilter">Filtrar por titulación: </label>
					<div className="big-input search-input box">
						<select id="degreeFilter" onChange={this.handleDegreeChange} value={selectedDegree}>
							<option value="">Todos</option>
							{uniqueDegrees.map(degree => (
								<option key={degree} value={degree}>{degree}</option>
							))}
						</select>
					</div>
					<br />
				</div>
				<SearchInput className="big-input search-input box" placeholder="Buscar asignatura..." throttle={0} onChange={this.searchUpdated} />
				<br />
				<p>
					Puedes ver los detalles de cada asignatura pulsando en su nombre.
				</p>
				<table className="full-width box">
					<thead>
						<tr>
							<th>
								<span onClick={() => this.sortBy('name')}>
									Nombre
									{sortConfig.key === 'name' && (
										<FontAwesomeIcon className="main-button-icon" icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />
									)}
								</span>
							</th>
							<th>
								<span onClick={() => this.sortBy('acronym')}>
									Identificador
									{sortConfig.key === 'acronym' && (
										<FontAwesomeIcon className="main-button-icon" icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />
									)}
								</span>
							</th>
							<th>
								<span onClick={() => this.sortBy('degree.acronym')}>
									Titulación
									{sortConfig.key === 'degree.acronym' && (
										<FontAwesomeIcon className="main-button-icon" icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />
									)}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedSubjects.map(subject => (
							<tr key={subject.id}>
								<td>
									<a href={`/subjects/${subject.id}`}>
										{subject.name}
									</a>
								</td>
								<td>
									<a href={`/subjects/${subject.id}`}>
										{subject.acronym || subject.id}
									</a>
								</td>
								<td>
									{subject.degree.acronym || subject.degree.id}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
