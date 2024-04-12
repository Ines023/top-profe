import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SubjectRow from './subcomponents/SubjectRow';
import { fetchDelete, fetchGet, fetchPost } from '../util';

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
		this.undoRating = this.undoRating.bind(this);
	}

	componentDidMount() {
		this.loadProfessorData();
	}

	loadProfessorData() {
		fetchGet(`/api/professors/${this.profId}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					professor: res,
				});
			});
	}

	submitRating(profId, subject, rating) {
		fetchPost(`/api/professors/${profId}/rate`, { subject, rating })
			.then(() => {
				// Load again the professor's profile to reflect the new data.
				this.loadProfessorData();
			});
	}

	undoRating(profId, subject, rating) {
		fetchDelete(`/api/professors/${profId}/undo`, { subject, rating })
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
					existingReview={professor.reviewed[subject.acronym]}
					onVote={this.submitRating}
					onUndo={this.undoRating}
				/>
			);
			subjectRows.push(row);
		}

		return (
			<div>
				<h2 className="centered">{professor.name}</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Asignatura</th>
							<th>Media</th>
							<th className="star-column">Tu puntuación</th>
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
