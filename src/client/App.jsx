import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
				<Route path="asignaturas" element={<SubjectRoutes />} />
				<Route path="profesores" element={<ProfessorRoutes />} />
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
			<Route path=":subjAcr" element={<SubjectDetails />} />
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
	);
}
