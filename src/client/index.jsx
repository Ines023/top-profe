import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './public/style.css';
import './public/fonts/hind.css';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(new Date().getFullYear(), document.getElementById('year'));
