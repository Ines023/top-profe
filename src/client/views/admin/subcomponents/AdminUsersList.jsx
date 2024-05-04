import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import UserRow from './UserRow';
import { fetchGet, fetchPut } from '../../../util';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default class AdminUsersSubjectsList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchKeyword: '',
			users: [],
			degrees: [],
			isLoaded: false,
			sortConfig: {
				key: 'id',
				direction: 'ascending',
			},
		};

		this.searchUpdated = this.searchUpdated.bind(this);
		this.loadUsers = this.loadUsers.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}

	componentDidMount() {
		this.loadUsers();
	}

	loadUsers() {
		fetchGet('/api/admin/degrees')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					degrees: res,
					isLoaded: true,
				});
			});

		fetchGet('/api/admin/users')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					users: res,
					isLoaded: true,
				});
			});
	}

	updateUser(user, field, value) {
		const loadingToast = toast.loading(`Actualizando ${user.id}`);
		const newUser = { ...user, [field]: value };
		fetchPut('/api/admin/users', { user: newUser })
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				toast.success('Usuario actualizado', { id: loadingToast });
				this.loadUsers();
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
			searchKeyword, users, degrees, isLoaded, sortConfig
		} = this.state;

		const { description } = this.props;

		const filteredUsers = users.filter(createFilter(
			searchKeyword, ['id', 'degreeId', 'type'],
		));

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		if (!users.length > 0) return (<h2 className="centered">No hay usuarios cargados</h2>);

		let sortedUsers = [...filteredUsers];
		if (sortConfig.key) {
			sortedUsers.sort((a, b) => {
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
					<h2 className="centered">Usuarios</h2>
					<SearchInput
						className="big-input search-input box"
						placeholder="Buscar usuario..."
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
								<th><span onClick={() => this.sortBy('type')}>Tipo {renderArrowIcon('type')}</span></th>
								<th><span onClick={() => this.sortBy('degreeId')}>Titulación {renderArrowIcon('degreeId')}</span></th>
								<th><span onClick={() => this.sortBy('active')}>Activo {renderArrowIcon('active')}</span></th>
								<th><span onClick={() => this.sortBy('admin')}>Admin {renderArrowIcon('admin')}</span></th>
								<th><span onClick={() => this.sortBy('excluded')}>Excluído {renderArrowIcon('excluded')}</span></th>
							</tr>
						</thead>
						<tbody>
							{sortedUsers.map(user => (
								<UserRow key={user.id} user={user} degrees={degrees} updateUser={this.updateUser} />
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
