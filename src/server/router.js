const express = require('express');
const controllers = require('./controllers');
const middlewares = require('./middlewares');
const mainController = require('./controllers/mainController');
const professorController = require('./controllers/professorController');
const subjectController = require('./controllers/subjectController');
const ballotController = require('./controllers/ballotController');
const adminController = require('./controllers/adminController');

const router = express.Router();

// All endpoints require authentication.
router.use(middlewares.checkLogin);

// Endpoints reachable by any authenticated user.
router.get('/user', mainController.getUser);
router.post('/user/activate', mainController.activateUser);
router.post('/user/degree', mainController.setUserDegree);
router.post('/opt-out', mainController.setOptOut);

router.get('/degrees', mainController.getDegrees);
router.get('/professors', professorController.getProfessors);
router.get('/professors/:professorHash', professorController.getProfessorProfile);
router.get('/subjects', subjectController.getSubjects);
router.get('/subjects/:subjectId', subjectController.getSubjectDetails);

// TODO
// router.get('/rankings', controllers.getRankings);

// Endpoints restricted to verified students.
router.get('/votes/:voteId', middlewares.restrictLimitedUsers, ballotController.getVote);
router.post('/ballots/:ballotId', middlewares.restrictLimitedUsers, ballotController.registerVote);
router.delete('/ballots/:ballotId', middlewares.restrictLimitedUsers, controllers.undoRate);

router.use(middlewares.restrictAdmins);
router.get('/admin', adminController.getAdminData);
router.get('/admin/degrees', adminController.getDegrees);
router.get('/admin/degrees/:degreeId', adminController.getDegree);

router.get('/admin/subjects/:degreeId', adminController.getSubjects);

router.get('/admin/update/subjects/:degreeId', adminController.fetchSubjects);
router.post('/admin/update/subjects/:degreeId', adminController.importSubjects);

router.get('/admin/update/professors/:degreeId/:academicYear', adminController.fetchProfessors);
router.post('/admin/update/professors/:degreeId/:academicYear', adminController.importProfessors);

router.get('/admin/professors', adminController.getProfessors);

module.exports = router;
