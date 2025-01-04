/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
	BrowserRouter, Routes, Route,
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
import AdminUpdateAllSubjectsView from './views/admin/AdminUpdateAllSubjectsView';
import AdminUpdateProfessorsView from './views/admin/AdminUpdateProfessorsView';
import AdminUpdateAllProfessorsView from './views/admin/AdminUpdateAllProfessorsView';
import AdminUploadProfessorsView from './views/admin/AdminUploadProfessorsView';
import AdminUploadAllProfessorsView from './views/admin/AdminUploadAllProfessorsView';
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
				<Route path="/" element={<InitialMenu />} />
				<Route path="subjects/*" element={<SubjectRoutes />} />
				<Route path="professors/*" element={<ProfessorRoutes />} />
				<Route path="rankings/*" element={<RankingView />} />
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
			<AdminNavbar />
			<br />
			<Routes>
				<Route index element={<AdminMainView />} />
				<Route path="degrees" element={<AdminDegreesView />} />
				<Route path="update">
					<Route path="subjects" element={<AdminDegreesView updateSubjects />} />
					<Route path="subjects/:degreeId" element={<AdminUpdateSubjectsView />} />
					<Route path="subjects/all" element={<AdminUpdateAllSubjectsView />} />

					<Route path="professors" element={<AdminDegreesView updateProfessors />} />
					<Route path="professors/:degreeId" element={<AdminUpdateProfessorsView />} />
					<Route path="professors/:degreeId/upload" element={<AdminUploadProfessorsView />} />
					<Route path="professors/all" element={<AdminUpdateAllProfessorsView />} />
					<Route path="professors/all/upload" element={<AdminUpdateAllProfessorsView />} />
				</Route>
				<Route path="subjects" element={<AdminDegreesView subjects />} />
				<Route path="subjects/:degreeId" element={<AdminEditSubjectsView />} />
				<Route path="professors" element={<AdminEditProfessorsView />} />
				<Route path="users" element={<AdminEditUsersView />} />
			</Routes>
		</>
	);
}