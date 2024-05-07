/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import toast, { LoaderIcon, ErrorIcon } from 'react-hot-toast';

export default function ProfessorRow(props) {
	const {
		ballotId,
		profAvg,
		profCount,
		profName,
		onVote,
		profHash,
		profStatus,
		voteExists,
		userIsStudent,
		userIsAdmin,
		subjectDegree,
		studentDegree,
	} = props;

	const [voteLoaded, setVoteLoaded] = useState(true);
	const [voteValue, setVoteValue] = useState();

	useEffect(() => {
		setVoteLoaded(true);
	}, [voteExists]);

	const sendVote = ((rating) => {
		let cancelVote = false;
		toast(t => (
			<span>
				<span>Emitiendo voto...</span>
				<button type="button" className="box main-button toast-button menu-item" onClick={() => { cancelVote = true; setVoteValue(); toast.success('Voto cancelado.', { id: t.id, icon: <ErrorIcon />, duration: 1500 }); }}>Cancelar</button>
			</span>
		),
		{
			icon: <LoaderIcon />,
			duration: 2500,
		});
		setTimeout(() => {
			if (!cancelVote) onVote(ballotId, rating);
			else setVoteLoaded(true);
		}, 2500);
	});

	return (
		<tr>
			<td>
				<a className={profStatus} href={`/professors/${profHash}`}>
					{profName}
				</a>
			</td>
			<td className={profStatus}>
				{(!userIsAdmin && profStatus === 'excluded') ? 'OCULTO' : profAvg
					? `${profAvg.toFixed(2)}/5 (total: ${profCount})`
					: 'Sin datos'
				}
			</td>
			<td>
				{(userIsStudent && subjectDegree === studentDegree) ? (voteExists ? 'Voto emitido' : (
					<Rating
						emptySymbol={<FontAwesomeIcon icon={faStar} />}
						fullSymbol={<FontAwesomeIcon icon={faStarSolid} />}
						initialRating={voteValue}
						onClick={(rating) => { setVoteValue(rating); setVoteLoaded(false); sendVote(rating); }}
						readonly={!voteLoaded}
					/>
				)) : 'Bloqueado'}
			</td>
		</tr>
	);
}
