/* eslint-disable no-nested-ternary */
import React from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default function ProfessorRow(props) {
	const {
		profAvg, profCount, profId, profName, onVote, profHash, profStatus, subjectId, voteExists,
	} = props;

	return (
		<tr>
			<td>
				<a href={`/professors/${profHash}`}>
					{profName}
				</a>
			</td>
			<td>
				{profStatus === 'excluded' ? 'OCULTO' : profAvg
					? `${profAvg.toFixed(2)}/5 (total: ${profCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteExists}
						onClick={rating => onVote(profId, subjectId, rating)}
					/>
				)}
			</td>
		</tr>
	);
}
