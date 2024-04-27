/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default function ProfessorRow(props) {
	const {
		ballotId, profAvg, profCount, profName, onVote, profHash, profStatus, voteExists,
	} = props;

	const [voteLoaded, setVoteLoaded] = useState(true);

	useEffect(() => {
		setVoteLoaded(true);
	}, [voteExists]);

	return (
		<tr>
			<td>
				<a className={profStatus} href={`/professors/${profHash}`}>
					{profName}
				</a>
			</td>
			<td className={profStatus}>
				{profStatus === 'excluded' ? 'OCULTO' : profAvg
					? `${profAvg.toFixed(2)}/5 (total: ${profCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{!voteLoaded ? 'Cargando...' : voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteExists}
						onClick={(rating) => { setVoteLoaded(false); onVote(ballotId, rating); }}
					/>
				)}
			</td>
		</tr>
	);
}
