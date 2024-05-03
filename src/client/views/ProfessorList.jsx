/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { fetchGet } from '../util';

export default class ProfessorList extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			professors: [],
			user: {},
			searchKeyword: '',
			sortConfig: {
				key: null,
				direction: 'ascending',
			},
		};

		this.searchUpdated = this.searchUpdated.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/user')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
			});

		fetchGet('/api/professors')
			.then(r => (r?.status === 200) && r.json())
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

	sortBy = (key) => {
		let { sortConfig } = this.state;
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		sortConfig = { key, direction };
		this.setState({ sortConfig });
	};

	render() {
		const {
			isLoaded, professors, searchKeyword, user, sortConfig,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		let sortedProfessors = [...professors];
		if (sortConfig.key) {
			sortedProfessors.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}

		const filteredProfessors = sortedProfessors.filter(createFilter(searchKeyword, 'name'));

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
							<th>
								<span onClick={() => this.sortBy('name')}>
									Nombre
									{sortConfig.key === 'name' && (
										<FontAwesomeIcon className="main-button-icon" icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />
									)}
								</span>
							</th>
							<th>
								<span onClick={() => this.sortBy('avg')}>
									Punt. media
									{sortConfig.key === 'avg' && (
										<FontAwesomeIcon className="main-button-icon" icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />
									)}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredProfessors.map(professor => (
							<tr key={professor.hash}>
								<td>
									<a href={`/professors/${professor.hash}`} className={professor.status}>
										{professor.name}
									</a>
								</td>
								<td className={professor.status}>
									{(!user.admin && professor.status === 'excluded') ? 'OCULTO' : professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
