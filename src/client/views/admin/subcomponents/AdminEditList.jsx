import React, { Component } from 'react';
import { fetchGet } from '../../../util';

export default class AdminEditList extends Component {
	constructor() {
		super();

		this.state = {
			isLoaded: false,
			object: {},
		};
	}

	componentDidMount() {
		this.setState ({
			object: this.props.object,
		});
	}

	render() {
		const { isLoaded } = this.state;
		const { object } = this.props;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<div>
				<h2 className="centered">Titulaciones</h2>
				<br />
				<p className="">
					Aquí se muestra un listado de todas las titulaciones disponibles.
				</p>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Campo</th>
							<th>Valor</th>
						</tr>
					</thead>
					<tbody>
						{ Object.entries(object).forEach((field, value) => (
							<tr key={field}>
								<td>
									<input type="text" value={field} />
								</td>
								<td>
									<input type="text" value={value} />
								</td>
							</tr>
						))
						}
					</tbody>
				</table>
			</div>
		);
	}
}
