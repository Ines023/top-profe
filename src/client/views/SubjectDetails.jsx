import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchGet, fetchPost } from '../util';
import ProfessorRow from './subcomponents/ProfessorRow';

function SubjectDetails(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class SubjectDetailsClass extends Component {
	constructor(props) {
		super(props);
		const { params: { subjId } } = this.props;
		this.subjId = subjId;

		this.state = {
			isLoaded: false,
			subject: {},
			ballots: {},
			user: {},
		};

		this.submitRating = this.submitRating.bind(this);
	}

	componentDidMount() {
		this.loadSubjectData();
	}

	loadSubjectData() {
		fetchGet('/api/user')
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
			});

		fetchGet(`/api/subjects/${this.subjId}`)
			.then(r => (r?.status ===200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					subject: res.subject,
					ballots: res.ballots,
				});
			});
	}

	submitRating(ballotId, stars) {
		fetchPost(`/api/ballots/${ballotId}`, { stars })
			.then(() => {
				// Load again the professor's profile to reflect the new data.
				this.loadSubjectData();
			});
	}

	render() {
		const {
			isLoaded, subject, ballots, user,
		} = this.state;

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		const professorRows = [];
		ballots.forEach((ballot) => {
			const { professor } = ballot;
			const row = (
				<ProfessorRow
					key={ballot.id}
					ballotId={ballot.id}
					profStatus={professor.status}
					profHash={professor.hash}
					profName={professor.name}
					profAvg={ballot.avg}
					profCount={ballot.count}
					userIsStudent={user.type === 'student'}
					userIsAdmin={user.admin}
					subjectDegree={subject.degreeId}
					studentDegree={user.degreeId}
					voteExists={ballot.register.length > 0}
					onVote={this.submitRating}
				/>
			);
			professorRows.push(row);
		});

		return (
			<div>
				<h2 className="centered">{subject.name}</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Profesor</th>
							<th>Media (en {subject.acronym || subject.id})</th>
							<th className="starColumn">Votar</th>
						</tr>
					</thead>
					<tbody>
						{ professorRows }
					</tbody>
				</table>
				<a className="back-link" href="/subjects">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de asignaturas
				</a>
			</div>
		);
	}
}

export default SubjectDetails(SubjectDetailsClass);
