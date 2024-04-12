import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ErrorView from './views/ErrorView';
import InitialMenu from './views/InitialMenu';
import LoginErrorView from './views/LoginErrorView';
import ProfessorList from './views/ProfessorList';
import ProfessorProfile from './views/ProfessorProfile';
import RankingView from './views/RankingView';
import AdminView from './views/admin/AdminView';
import AdminDegreesList from './views/admin/AdminDegreesList';
import AdminUpdater from './views/admin/AdminUpdater';
import SubjectDetails from './views/SubjectDetails';
import SubjectList from './views/SubjectList';
import AdminSubjectsList from './views/admin/AdminSubjectsList';

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={InitialMenu} />
				<Route exact path="/asignaturas" component={SubjectList} />
				<Route path="/asignaturas/:subjAcr" component={SubjectDetails} />
				<Route exact path="/profesores" component={ProfessorList} />
				<Route path="/profesores/:profId" component={ProfessorProfile} />
				<Route path="/ranking" component={RankingView} />
				<Route exact path="/admin" component={AdminView} />
				<Route path="/admin/degrees" component={AdminDegreesList} />
				<Route exact path="/admin/update" component={AdminUpdater} />
				<Route path="/admin/update/:degreeId" component={AdminSubjectsList} />
				<Route path="/failed-login" component={LoginErrorView} />
				<Route path="/500" render={props => <ErrorView {...props} code={500} />} />
				<Route render={props => <ErrorView {...props} code={404} />} />
			</Switch>
		</BrowserRouter>
	);
}
