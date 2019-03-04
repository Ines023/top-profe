import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SubjectRow from './subcomponents/SubjectRow';
import { fetchGet, fetchPost } from '../util';

export default class ProfessorProfile extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { profId } } = match;
		this.profId = profId;

		this.state = {
			isLoaded: false,
			professor: {},
		};

		this.submitRating = this.submitRating.bind(this);
	}

	componentDidMount() {
		this.loadProfessorData();
	}

	loadProfessorData() {
		fetchGet(`/api/v1/professors/${this.profId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					professor: res,
				});
			});
	}

	submitRating(profId, subject, rating) {
		fetchPost(`/api/v1/professors/${profId}/rate`, { subject, rating })
			.then(() => {
				// Load again the professor's profile to reflect the new data.
				this.loadProfessorData();
			});
	}

	render() {
		const { isLoaded, professor } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const subjectRows = [];
		for (let i = 0; i < professor.subjects.length; i++) {
			const subject = professor.subjects[i];
			const row = (
				<SubjectRow
					key={i}
					profId={professor.profId}
					subjectAcronym={subject.acronym}
					subjectName={subject.name}
					subjectAvg={subject.avg}
					subjectCount={subject.count}
					alreadyReviewed={subject.acronym in professor.reviewed}
					onVote={this.submitRating}
				/>
			);
			subjectRows.push(row);
		}

		return (
			<div>
				<h2 className="subtitle centered">{professor.name}</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Asignatura</th>
							<th>Media</th>
							<th>Tu puntuación</th>
						</tr>
					</thead>
					<tbody>
						{ subjectRows }
					</tbody>
				</table>
				<a className="back-link" href="/profesores">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de profesores
				</a>
			</div>
		);
	}
}
