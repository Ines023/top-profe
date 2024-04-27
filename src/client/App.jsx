/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
	BrowserRouter, Routes, Route, Link,
} from 'react-router-dom';
import ErrorView from './views/ErrorView';
import InitialMenu from './views/InitialMenu';
import LoginErrorView from './views/LoginErrorView';
import ProfessorList from './views/ProfessorList';
import ProfessorProfile from './views/ProfessorProfile';
import RankingView from './views/RankingView';
import AdminMainView from './views/admin/AdminMainView';
import AdminDegreesView from './views/admin/AdminDegreesView';
import SubjectDetails from './views/SubjectDetails';
import SubjectList from './views/SubjectList';
import AdminUpdateSubjectsView from './views/admin/AdminUpdateSubjectsView';
import AdminUpdateProfessorsView from './views/admin/AdminUpdateProfessorsView';
import AdminEditSubjectsView from './views/admin/AdminEditSubjectsView';
import AdminEditProfessorsView from './views/admin/AdminEditProfessorsView';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<InitialMenu />} />
				<Route path="subjects/*" element={<SubjectRoutes />} />
				<Route path="professors/*" element={<ProfessorRoutes />} />
				<Route path="ranking" element={<RankingView />} />
				<Route path="admin/*" element={<AdminRoutes />} />
				<Route path="failed-login" element={<LoginErrorView />} />
				<Route path="500" element={<ErrorView code={500} />} />
				<Route path="*" element={<ErrorView code={404} />} />
			</Routes>
		</BrowserRouter>
	);
}

function SubjectRoutes() {
	return (
		<Routes>
			<Route index element={<SubjectList />} />
			<Route path=":subjId" element={<SubjectDetails />} />
		</Routes>
	);
}

function ProfessorRoutes() {
	return (
		<Routes>
			<Route index element={<ProfessorList />} />
			<Route path=":profId" element={<ProfessorProfile />} />
		</Routes>
	);
}

function AdminRoutes() {
	return (
		<>
			<nav>
				<ul className="navbar">
					<li><Link to="/admin">Inicio</Link></li>
					<li>
						<a href="#">Editar</a>
						<ul className="subnav">
							<li><Link to="/admin/degrees">Titulaciones</Link></li>
							<li><Link to="/admin/subjects">Asignaturas</Link></li>
							<li><Link to="/admin/professors">Profesores</Link></li>
						</ul>
					</li>
					<li>
						<a href="#">Actualizar</a>
						<ul className="subnav">
							<li><Link to="/admin/update/subjects">Asignaturas</Link></li>
							<li><Link to="/admin/update/professors">Profesores</Link></li>
						</ul>
					</li>
				</ul>
			</nav>
			<br />
			<Routes>
				<Route index element={<AdminMainView />} />
				<Route path="degrees" element={<AdminDegreesView />} />
				<Route path="update">
					<Route path="subjects" element={<AdminDegreesView updateSubjects />} />
					<Route path="subjects/:degreeId" element={<AdminUpdateSubjectsView />} />

					<Route path="professors" element={<AdminDegreesView updateProfessors />} />
					<Route path="professors/:degreeId" element={<AdminUpdateProfessorsView />} />
				</Route>
				<Route path="subjects" element={<AdminDegreesView subjects />} />
				<Route path="subjects/:degreeId" element={<AdminEditSubjectsView />} />
				<Route path="professors" element={<AdminEditProfessorsView />} />
			</Routes>
		</>
	);
}
