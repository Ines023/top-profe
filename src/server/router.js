const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

// All endpoints require authentication.
router.use(controllers.checkLogin);

router.get('/professors', controllers.getProfessors);
router.get('/professors/:profId', controllers.getProfessorProfile);
router.post('/professors/:profId/rate', controllers.rateProfessor);
router.get('/subjects', controllers.getSubjects);
router.get('/subjects/:subjAcr', controllers.getSubjectDetails);

module.exports = router;
