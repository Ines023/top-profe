/* eslint-disable max-len */
import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import UserRow from './UserRow';
import { fetchGet, fetchPut } from '../../../util';
import toast from 'react-hot-toast';

export default class AdminUsersSubjectsList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchKeyword: '',
			users: [],
			degrees: [],
			isLoaded: false,
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
		const newUser = {...user, [field]: value}
		fetchPut('/api/admin/users', { user: newUser })
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				toast.success('Usuario actualizado', {id: loadingToast});
				this.loadUsers()
			});
	}

	searchUpdated(searchKeyword) {
		this.setState({
			// Remove accents from the search keywords.
			searchKeyword: searchKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		});
	}

	render() {
		const {
			searchKeyword, users, degrees, isLoaded
		} = this.state;

		const { description } = this.props;

		const filteredUsers = users.filter(createFilter(
			searchKeyword, ['id', 'degreeId', 'type'],
		));


		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		if (!users.length > 0) return(<h2 className="centered">No hay usuarios cargdos</h2>)

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
								<th>Id</th>
								<th>Tipo</th>
								<th>Titulación</th>
								<th>Activo</th>
								<th>Admin</th>
								<th>Excluído</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map(user => (
								<UserRow key={user.id} user={user} degrees={degrees} updateUser={this.updateUser} />
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}
