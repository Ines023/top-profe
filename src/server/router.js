const express = require('express');
const controllers = require('./controllers');
const middlewares = require('./middlewares');
const professorController = require('./controllers/professorController');
const adminController = require('./controllers/adminController');

const router = express.Router();

// All endpoints require authentication.
router.use(middlewares.checkLogin);

// Endpoints reachable by any authenticated user.
router.get('/professors', professorController.getProfessors);
router.get('/professors/:profId', controllers.getProfessorProfile);
router.get('/subjects', controllers.getSubjects);
router.get('/subjects/:subjAcr', controllers.getSubjectDetails);
router.get('/rankings', controllers.getRankings);

// Endpoints restricted to verified students.
router.use(middlewares.restrictLimitedUsers);
router.post('/professors/:profId/rate', controllers.rateProfessor);
router.delete('/professors/:profId/undo', controllers.undoRate);

// router.use(middlewares.restrictAdmins);
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
