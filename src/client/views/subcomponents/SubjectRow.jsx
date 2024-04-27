/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default function SubjectRow(props) {
	const {
		ballotId,
		voteExists,
		subjectId,
		subjectAcronym,
		subjectName,
		subjectAvg,
		subjectCount,
		profStatus,
		onVote,
		userIsStudent,
		userIsAdmin,
		subjectDegree,
		studentDegree,
	} = props;

	const [voteLoaded, setVoteLoaded] = useState(true);

	useEffect(() => {
		setVoteLoaded(true);
	}, [voteExists]);

	return (
		<tr>
			<td>
				<a href={`/subjects/${subjectId}`}>
					{subjectAcronym || subjectId} &mdash; {subjectName}
				</a>
			</td>
			<td className={profStatus}>
				{ (!userIsAdmin && profStatus === 'excluded') ? 'OCULTO' : subjectAvg
					? `${subjectAvg.toFixed(2)}/5 (total: ${subjectCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{(userIsStudent && subjectDegree === studentDegree) ? (!voteLoaded ? 'Cargando...' : voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteExists}
						onClick={(rating) => { setVoteLoaded(false); onVote(ballotId, rating); }}
					/>
				)) : 'Bloqueado'}
			</td>
		</tr>
	);
}
