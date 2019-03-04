import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ErrorView from './views/ErrorView';
import InitialMenu from './views/InitialMenu';
import LoginErrorView from './views/LoginErrorView';
import ProfessorList from './views/ProfessorList';
import ProfessorProfile from './views/ProfessorProfile';
import SubjectDetails from './views/SubjectDetails';
import SubjectList from './views/SubjectList';
import WelcomePage from './views/WelcomePage';

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={InitialMenu} />
				<Route path="/bienvenida" component={WelcomePage} />
				<Route exact path="/asignaturas" component={SubjectList} />
				<Route path="/asignaturas/:subjAcr" component={SubjectDetails} />
				<Route exact path="/profesores" component={ProfessorList} />
				<Route path="/profesores/:profId" component={ProfessorProfile} />
				<Route path="/failed-login" component={LoginErrorView} />
				<Route path="/500" render={props => <ErrorView {...props} code={500} />} />
				<Route render={props => <ErrorView {...props} code={404} />} />
			</Switch>
		</BrowserRouter>
	);
}
