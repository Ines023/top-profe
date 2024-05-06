const express = require('express');
const middlewares = require('./middlewares');
const mainController = require('./controllers/mainController');
const professorController = require('./controllers/professorController');
const subjectController = require('./controllers/subjectController');
const ballotController = require('./controllers/ballotController');
const adminController = require('./controllers/adminController');

const router = express.Router();

// All endpoints require authentication.
router.use(middlewares.checkLogin);

// Excluded users cannot access application.
router.use(middlewares.restrictExcluded);

// Endpoints reachable by any authenticated user.
router.get('/user', mainController.getUser);
router.post('/user/activate', mainController.activateUser);
router.post('/user/degree', mainController.setUserDegree);
router.get('/degrees', mainController.getDegrees);

// Endpoints require active users.
router.use(middlewares.checkActive);

router.post('/opt-out', mainController.setOptOut);

router.get('/professors', professorController.getProfessors);
router.get('/professors/:professorHash', professorController.getProfessorProfile);
router.get('/subjects', subjectController.getSubjects);
router.get('/subjects/:subjectId', subjectController.getSubjectDetails);

// TODO
// router.get('/rankings', controllers.getRankings);

// Endpoints restricted to verified students.
router.post('/ballots/:ballotId', middlewares.restrictLimitedUsers, ballotController.registerVote);
router.get('/votes/:voteId', middlewares.restrictLimitedUsers, ballotController.getVote);
router.get('/votes/:voteId/confirmation', middlewares.restrictLimitedUsers, ballotController.getVoteConfirmation);
router.delete('/votes/:voteId', middlewares.restrictLimitedUsers, ballotController.deleteVote);

router.use(middlewares.restrictAdmins);
router.get('/admin', mainController.getUser);
router.get('/admin/degrees', adminController.getDegrees);
router.get('/admin/degrees/:degreeId', adminController.getDegree);

router.get('/admin/subjects/:degreeId', adminController.getSubjects);

router.get('/admin/update/subjects/:degreeId', adminController.fetchSubjects);
router.post('/admin/update/subjects/:degreeId', adminController.importSubjects);

router.get('/admin/update/professors/:degreeId/:academicYear', adminController.fetchProfessors);
router.post('/admin/update/professors/:degreeId/:academicYear', adminController.importProfessors);

router.get('/admin/professors', adminController.getProfessors);
router.put('/admin/professors', adminController.updateProfessor);

router.get('/admin/users', adminController.getUsers);
router.put('/admin/users', adminController.updateUser);


module.exports = router;
