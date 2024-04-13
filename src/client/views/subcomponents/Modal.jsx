/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Modal = ({
	show, allowClose, onClose, children,
}) => {
	const showHideClassName = show ? 'modal display-block' : 'modal display-none';

	return (
		<>
			{show && (
				<div className={showHideClassName}>
					<div className="modal-main">
						{allowClose && (
							<button type="button" className="box main-button close-button menu-item" onClick={onClose}>
								<FontAwesomeIcon className="main-button-icon cross" icon={faPlus} />
							</button>
						)}
						<div className="modal-content">{children}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Modal;
