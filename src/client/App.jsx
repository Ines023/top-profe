/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
	BrowserRouter, Routes, Route, useSearchParams,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AdminUploadProfessorsView from './views/admin/AdminUploadProfessorsView';
import AdminEditSubjectsView from './views/admin/AdminEditSubjectsView';
import AdminEditProfessorsView from './views/admin/AdminEditProfessorsView';
import AdminEditUsersView from './views/admin/AdminEditUsersView';
import AdminNavbar from './views/admin/subcomponents/AdminNavbar';
import VoteView from './views/VoteView';

export default function App() {
	return (
		<BrowserRouter>
			<Toaster toastOptions={{ className: 'toast', duration: 3000 }} />
			<Routes>
				<Route path="/*" element={<RewindableRoutes />} />
				<Route path="admin/*" element={<AdminRoutes />} />
				<Route path="votes/:voteId" element={<VoteView />} />
				<Route path="failed-login" element={<LoginErrorView />} />
				<Route path="403" element={<ErrorView code={403} />} />
				<Route path="500" element={<ErrorView code={500} />} />
				<Route path="*" element={<ErrorView code={404} />} />
			</Routes>
		</BrowserRouter>
	);
}


function RewindableRoutes() {
	const [searchParams] = useSearchParams();
	const academicYear = searchParams.get('academicYear');

	// Validamos el formato del año académico para pasarlo a los componentes
	const validAcademicYear = /^[0-9]{4}-[0-9]{2}$/.test(academicYear) ? academicYear : null;

	return (
		<Routes>
			<Route index element={<InitialMenu academicYear={validAcademicYear} />} />
			<Route path="subjects/*" element={<SubjectRoutes academicYear={validAcademicYear} />} />
			<Route path="professors/*" element={<ProfessorRoutes academicYear={validAcademicYear} />} />
			<Route path="rankings" element={<RankingView academicYear={validAcademicYear} />} />
		</Routes>
	);
}

function SubjectRoutes({ academicYear }) {
	return (
		<Routes>
			<Route index element={<SubjectList academicYear={academicYear} />} />
			<Route path=":subjId" element={<SubjectDetails academicYear={academicYear} />} />
		</Routes>
	);
}

function ProfessorRoutes({ academicYear }) {
	return (
		<Routes>
			<Route index element={<ProfessorList academicYear={academicYear} />} />
			<Route path=":profId" element={<ProfessorProfile academicYear={academicYear} />} />
		</Routes>
	);
}

function AdminRoutes() {
	return (
		<>
			<AdminNavbar />
			<br />
			<Routes>
				<Route index element={<AdminMainView />} />
				<Route path="degrees" element={<AdminDegreesView />} />
				<Route path="update">
					<Route path="subjects" element={<AdminDegreesView updateSubjects />} />
					<Route path="subjects/:degreeId" element={<AdminUpdateSubjectsView />} />

					<Route path="professors" element={<AdminDegreesView updateProfessors />} />
					<Route path="professors/:degreeId" element={<AdminUpdateProfessorsView />} />
					<Route path="professors/:degreeId/upload" element={<AdminUploadProfessorsView />} />
				</Route>
				<Route path="subjects" element={<AdminDegreesView subjects />} />
				<Route path="subjects/:degreeId" element={<AdminEditSubjectsView />} />
				<Route path="professors" element={<AdminEditProfessorsView />} />
				<Route path="users" element={<AdminEditUsersView />} />
			</Routes>
		</>
	);
}