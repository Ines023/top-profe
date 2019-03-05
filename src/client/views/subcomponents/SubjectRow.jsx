import React, { Component } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default class SubjectRow extends Component {
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
			existingReview, subjectAcronym, subjectName, subjectAvg, subjectCount,
		} = this.props;

		return (
			<tr>
				<td>
					{subjectAcronym} &mdash; {subjectName}
				</td>
				<td>
					{subjectAvg
						? `${subjectAvg.toFixed(2)}/5 (total: ${subjectCount})`
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
