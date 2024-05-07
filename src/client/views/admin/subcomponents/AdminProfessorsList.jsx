/* eslint-disable max-len */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import ProfessorRow from './ProfessorRow';
import { fetchGet, fetchPut } from '../../../util';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default class AdminProfessorsSubjectsList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchKeyword: '',
			isLoaded: false,
			professors: [],
			sortConfig: {
				key: 'id',
				direction: 'ascending',
			},
		};

		this.searchUpdated = this.searchUpdated.bind(this);
		this.loadProfessors = this.loadProfessors.bind(this);
		this.updateProfessor = this.updateProfessor.bind(this);
	}

	componentDidMount() {
		this.loadProfessors();
	};

	loadProfessors() {
		fetchGet('/api/admin/professors')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					professors: res,
					isLoaded: true,
				});
			});
	};

	updateProfessor(professor, field, value) {
		const loadingToast = toast.loading(`Actualizando ${professor.id}`);
		const newProfessor = { ...professor, [field]: value };
		fetchPut('/api/admin/professors', { professor: newProfessor })
			.then(r => (r?.status === 200) && r.json())
			.then((res) => 
				res ? toast.success('Profesor actualizado.', { id: loadingToast }) : toast.dismiss(loadingToast))
			.finally(() => this.loadProfessors());
	};

	searchUpdated(searchKeyword) {
		this.setState({
			// Remove accents from the search keywords.
			searchKeyword: searchKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		});
	};

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
			searchKeyword, professors, isLoaded, sortConfig,
		} = this.state;

		const { description } = this.props;

		const filteredProfessors = professors.filter(createFilter(
			searchKeyword, ['id', 'name', 'status'],
		));

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		if (!professors.length > 0) return (<h2 className="centered">No hay profesores cargados</h2>);

		let sortedProfessors = [...filteredProfessors];
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

		const renderArrowIcon = (columnName) => {
			if (sortConfig.key === columnName) {
				return <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown} />;
			}
			return null;
		};

		return (
			<>
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
						{description}
					</p>
					<table className="full-width box">
						<thead>
							<tr>
								<th><span onClick={() => this.sortBy('id')}>Id {renderArrowIcon('id')}</span></th>
								<th><span onClick={() => this.sortBy('name')}>Nombre {renderArrowIcon('name')}</span></th>
								<th><span onClick={() => this.sortBy('status')}>Estado {renderArrowIcon('status')}</span></th>
							</tr>
						</thead>
						<tbody>
							{sortedProfessors.map(professor => (
								<ProfessorRow professor={professor} updateProfessor={this.updateProfessor} />
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
