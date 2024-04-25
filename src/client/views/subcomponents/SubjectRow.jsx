/* eslint-disable no-nested-ternary */
import React from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default function SubjectRow(props) {
	const {
		voteExists,
		subjectId,
		subjectAcronym,
		subjectName,
		subjectAvg,
		subjectCount,
		profId,
		profStatus,
		onVote,
	} = props;

	return (
		<tr>
			<td>
				{subjectAcronym || subjectId} &mdash; {subjectName}
			</td>
			<td className={profStatus}>
				{profStatus === 'excluded' ? 'OCULTO' : subjectAvg
					? `${subjectAvg.toFixed(2)}/5 (total: ${subjectCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteExists}
						onClick={rating => onVote(profId, subjectAcronym, rating)}
					/>
				)}
			</td>
		</tr>
	);
}
