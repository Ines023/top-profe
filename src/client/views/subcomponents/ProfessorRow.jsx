import React, { Component } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default class ProfessorRow extends Component {
	constructor(props) {
		super(props);
		this.handleVote = this.handleVote.bind(this);
	}

	handleVote(rating) {
		const {
			existingReview, onVote, onUndo, profId, subjectAcronym,
		} = this.props;
		if (rating !== existingReview) return onVote(profId, subjectAcronym, rating);
		return onUndo(profId, subjectAcronym, rating);
	}

	render() {
		const {
			existingReview, profAvg, profCount, profId, profName,
		} = this.props;

		return (
			<tr>
				<td>
					<a href={`/profesores/${profId}`}>
						{profName}
					</a>
				</td>
				<td>
					{profAvg
						? `${profAvg.toFixed(2)}/5 (total: ${profCount})`
						: 'Sin datos'
					}
				</td>
				<td>
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={existingReview}
						onClick={this.handleVote}
					/>
				</td>
			</tr>
		);
	}
}
