import React, { Component } from 'react';
import { fetchGet } from '../util';

export default class ProfessorList extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			topProfessors: [],
			botProfessors: [],
			mostVotedProfessors: [],
		};
	}

	componentDidMount() {
		fetchGet('/api/v1/rankings')
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					topProfessors: res.topProfessors,
					botProfessors: res.botProfessors,
					mostVotedProfessors: res.mostVotedProfessors,
				});
			});
	}

	render() {
		const {
			isLoaded, topProfessors, botProfessors, mostVotedProfessors,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<div>
				<h2 className="centered">Ranking global</h2>
				<p>
					Estos son los tres principales rankings de todos los
					profesores del Top Profe. Puedes entrar en el perfil de
					cada profesor pulsando en su nombre.
				</p>
				<p>
					Puedes encontrar más información sobre la
					puntuación <em>TopScore</em> y cómo se calcula en
					las <a href="https://dat.etsit.upm.es/top-profe#top-score">preguntas frecuentes</a>.
				</p>

				<h3>Los 10 mejores</h3>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>TopScore</th>
							<th>Media</th>
						</tr>
					</thead>
					<tbody>
						{ topProfessors.map(professor => (
							<tr key={professor.id}>
								<td>
									<a href={`/profesores/${professor.id}`}>
										{professor.name}
									</a>
								</td>
								<td>{professor.score.toFixed(1)}</td>
								<td>
									{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						)) }
					</tbody>
				</table>

				<h3>Los 10 peores</h3>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>TopScore</th>
							<th>Punt. media</th>
						</tr>
					</thead>
					<tbody>
						{ botProfessors.map(professor => (
							<tr key={professor.id}>
								<td>
									<a href={`/profesores/${professor.id}`}>
										{professor.name}
									</a>
								</td>
								<td>{professor.score.toFixed(1)}</td>
								<td>
									{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						)) }
					</tbody>
				</table>

				<h3>Los 10 más votados</h3>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Punt. media</th>
						</tr>
					</thead>
					<tbody>
						{ mostVotedProfessors.map(professor => (
							<tr key={professor.id}>
								<td>
									<a href={`/profesores/${professor.id}`}>
										{professor.name}
									</a>
								</td>
								<td>
									{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						)) }
					</tbody>
				</table>
			</div>
		);
	}
}
