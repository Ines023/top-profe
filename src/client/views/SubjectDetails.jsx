import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchDelete, fetchGet, fetchPost } from '../util';
import ProfessorRow from './subcomponents/ProfessorRow';

export default class SubjectDetails extends Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { params: { subjAcr } } = match;
		this.subjAcr = subjAcr;

		this.state = {
			isLoaded: false,
			subject: {},
		};

		this.submitRating = this.submitRating.bind(this);
		this.undoRating = this.undoRating.bind(this);
	}

	componentDidMount() {
		this.loadSubjectData();
	}

	loadSubjectData() {
		fetchGet(`/api/v1/subjects/${this.subjAcr}`)
			.then(r => r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subject: res,
				});
			});
	}

	submitRating(profId, subject, rating) {
		fetchPost(`/api/v1/professors/${profId}/rate`, { subject, rating })
			.then(() => {
				// Load again the professor's profile to reflect the new data.
				this.loadSubjectData();
			});
	}

	undoRating(profId, subject, rating) {
		fetchDelete(`/api/v1/professors/${profId}/undo`, { subject, rating })
			.then(() => {
				// Load again the professor's profile to reflect the new data.
				this.loadSubjectData();
			});
	}

	render() {
		const { isLoaded, subject } = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const professorRows = [];
		for (let i = 0; i < subject.professors.length; i++) {
			const professor = subject.professors[i];
			const row = (
				<ProfessorRow
					key={i}
					profId={professor.id}
					profName={professor.name}
					profAvg={professor.avg}
					profCount={professor.count}
					subjectAcronym={this.subjAcr}
					existingReview={subject.reviewed[professor.id]}
					onVote={this.submitRating}
					onUndo={this.undoRating}
				/>
			);
			professorRows.push(row);
		}

		return (
			<div>
				<h2 className="centered">{subject.name}</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Profesor</th>
							<th>Media (en {this.subjAcr})</th>
							<th clasName="starColumn">Tu puntuación</th>
						</tr>
					</thead>
					<tbody>
						{ professorRows }
					</tbody>
				</table>
				<a className="back-link" href="/asignaturas">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de asignaturas
				</a>
			</div>
		);
	}
}
