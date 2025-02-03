import React, { Component } from 'react';
import { fetchGet } from '../util';

export default class RankingView extends Component {
	constructor() {
		super();
		this.state = {
			isLoaded: false,
			topProfessors: [],
			worstProfessors: [],
			mostVotedProfessors: [],
			currentAcademicYear: '',
		};
	}

	componentDidMount() {
		fetchGet('/api/currentAcademicYear')
		.then(r => (r?.status === 200) && r.json())
		.then((res) => {
		  this.setState({ currentAcademicYear: res.currentAcademicYear });
		});

		fetchGet('/api/rankings')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					topProfessors: res.topProfessors || [],
					worstProfessors: res.worstProfessors || [],
					mostVotedProfessors: res.mostVotedProfessors,
				});
			});
	}

	render() {
		const {
			isLoaded, topProfessors, worstProfessors, mostVotedProfessors, currentAcademicYear
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<div>
				<h2 className="centered">Ranking global</h2>

				{(topProfessors.length === 0 && worstProfessors.length === 0) ? (
					<p>
						Este es el ranking provisional del curso {currentAcademicYear} de todos los
						profesores del Top Profe. Puedes entrar en el perfil de
						cada profesor pulsando en su nombre.
					</p>
				) : (
					<>
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
								{topProfessors.map(professor => (
									<tr key={professor.id}>
										<td>
											<a href={`/professors/${professor.id}`}>
												{professor.name}
											</a>
										</td>
										<td>{professor.score.toFixed(1)}</td>
										<td>
											{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
										</td>
									</tr>
								))}
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
								{worstProfessors.map(professor => (
									<tr key={professor.id}>
										<td>
											<a href={`/professors/${professor.id}`}>
												{professor.name}
											</a>
										</td>
										<td>{professor.score.toFixed(1)}</td>
										<td>
											{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}

				<h3>Los 10 más votados</h3>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Punt. media</th>
						</tr>
					</thead>
					<tbody>
						{mostVotedProfessors.map(professor => (
							<tr key={professor.id}>
								<td>
									<a href={`/professors/${professor.id}`}>
										{professor.name}
									</a>
								</td>
								<td>
									{professor.avg ? `${professor.avg.toFixed(2)}/5 (total: ${professor.count})` : '-'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
