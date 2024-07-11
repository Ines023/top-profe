import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import App from './App';

import './public/style.css';
import './public/custom.css';
import './public/fonts/hind.css';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(new Date().getFullYear(), document.getElementById('year'));
ReactDOM.render(<><a href="https://github.com/DAT-ETSIT/top-profe"><FontAwesomeIcon className="main-button-icon" icon={faGithub} /></a></>, document.getElementById('github'));
