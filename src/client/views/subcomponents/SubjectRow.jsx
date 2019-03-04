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
		const { onVote, profId, subjectAcronym } = this.props;
		onVote(profId, subjectAcronym, rating);
	}

	render() {
		const {
			alreadyReviewed, subjectAcronym, subjectName, subjectAvg, subjectCount,
		} = this.props;

		return (
			<tr>
				<td>
					{subjectAcronym} &mdash; {subjectName}
				</td>
				<td>
					{subjectAvg
						? `${subjectAvg}/5 (total: ${subjectCount})`
						: 'Sin datos'
					}
				</td>
				<td>
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						readonly={alreadyReviewed}
						initialRating={Math.round(subjectAvg * 100) / 100}
						onChange={this.handleVote}
					/>
				</td>
			</tr>
		);
	}
}
