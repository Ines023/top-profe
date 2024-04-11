const express = require('express');
const controllers = require('./controllers');
const middlewares = require('./middlewares');

const router = express.Router();

// All endpoints require authentication.
router.use(middlewares.checkLogin);

// Endpoints reachable by any authenticated user.
router.get('/professors', controllers.getProfessors);
router.get('/professors/:profId', controllers.getProfessorProfile);
router.get('/subjects', controllers.getSubjects);
router.get('/subjects/:subjAcr', controllers.getSubjectDetails);
router.get('/rankings', controllers.getRankings);

// Endpoints restricted to verified students.
router.use(middlewares.restrictLimitedUsers);
router.post('/professors/:profId/rate', controllers.rateProfessor);
router.delete('/professors/:profId/undo', controllers.undoRate);

router.user(middlewares.restrictAdmins);


module.exports = router;
