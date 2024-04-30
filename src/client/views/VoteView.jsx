import React, { Component, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar as faStarSolid, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Modal from './subcomponents/Modal';
import { fetchDelete, fetchGet } from '../util';
import toast from 'react-hot-toast';

function VoteView(ComponentClass) {
	return props => <ComponentClass {...props} params={useParams()} />;
}

class VoteViewClass extends Component {
	constructor(props) {
		super(props);
		const { params: { voteId } } = this.props;
		this.voteId = voteId;

		this.state = {
			isLoaded: false,
			vote: {},
			ballot: {},
			professor: {},
			subject: {},
			user: {},
			key: null,
			redirect: false,
		};

		this.deleteRating = this.deleteRating.bind(this);
	}

	componentDidMount() {
		fetchGet('/api/user')
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					user: res,
				});
			});

		const key = new URLSearchParams(window.location.search).get('key');

		fetchGet(`/api/votes/${this.voteId}?key=${key}`)
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				this.setState({
					isLoaded: true,
					vote: res,
					ballot: res.ballot,
					professor: res.ballot.professor,
					subject: res.ballot.subject,
					key: key,
					showConfirmation: false,
				});
			});
	}

	deleteRating() {
		this.setState({
			showConfirmation: false
		});

		const loadingToast = toast.loading('Eliminando voto...');
		fetchDelete(`/api/votes/${this.voteId}?key=${this.state.key}`, {})
			.then(r => (r?.status === 200) && r.json())
			.then((res) => {
				toast.dismiss(loadingToast);
				toast.success('Voto eliminado.');
			})
			.catch(() => {
				loadingToast.dismiss();
				toast.error('Error eliminando el voto.');
			})
			.finally(() => this.setState({
				redirect: true
			}))
	}

	render() {
		const {
			isLoaded, vote, ballot, professor, subject, user, showConfirmation, redirect
		} = this.state;

		if (redirect) return (<Navigate to={`/professors/${professor.hash}`} />)

		if (!isLoaded) return (<div className="full-width">Cargando...</div>);

		return (
			<div>
				<h2 className="centered">{professor.name}</h2>
				<table className="full-width box">
					<thead>
						<tr>
							<th>Asignatura</th>
							<th>Media</th>
							<th className="star-column">Tu voto</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<a href={`/subjects/${subject.id}`}>
									{subject.name} ({subject.acronym || subject.id})
								</a>
							</td>
							<td className={professor.status}>
								{(!user.admin && professor.status === 'excluded') ? 'OCULTO' : ballot.avg
									? `${ballot.avg.toFixed(2)}/5 (total: ${ballot.count})`
									: 'Sin datos'
								}
							</td>
							<td>
								{<Rating
									emptySymbol={<FontAwesomeIcon icon={faStar} />}
									fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
									initialRating={vote.stars}
									readonly
								/>}
							</td>
						</tr>
					</tbody>
				</table>
				<br />
				<button type="button" className="box main-button menu-item" onClick={() => this.setState({ showConfirmation: true })}>
					Eliminar voto
					<FontAwesomeIcon className="main-button-icon" icon={faTrash} />
				</button>
				<Modal show={showConfirmation} allowClose onClose={() => this.setState({ showConfirmation: false })}>
					<h2>¿Estás seguro de que quieres eliminar este voto?</h2>
					<p>Esta acción no es reversible.</p>
					<button type="button" className="box main-button menu-item" onClick={() => this.deleteRating()}>
						Eliminar voto
					</button>
				</Modal>
				<a className="back-link" href="/professors">
					<FontAwesomeIcon className="back-icon" icon={faArrowLeft} />Volver al listado de profesores
				</a>
			</div>
		);
	}
}

export default VoteView(VoteViewClass);
