const mysql = require('promise-mysql');
const pool = require('./db');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('./errors');

module.exports.checkLogin = (req, res, next) => {
	if (!req.session.user) next(new UnauthorizedError());
	next();
};

module.exports.logout = (req, res) => {
	req.session.destroy();
	return res.sendStatus(200);
};

module.exports.getProfessors = (req, res, next) => (
	// Returns a list with all the professors registered in the application,
	// along with their average scoring.
	pool.query('SELECT professor.id, professor.name, avg(review.stars) AS avg, '
		+ 'count(review.stars) AS count '
		+ 'FROM professor '
		+ 'LEFT JOIN review ON review.prof_id = professor.id '
		+ 'GROUP BY professor.id '
		+ 'ORDER BY avg DESC, count DESC')
		.then((professors) => {
			res.json({ professors });
		})
		.catch(e => next(e))
);

module.exports.getProfessorProfile = (req, res, next) => {
	// Returns a list with all the subjects taught by a specific professor, and
	// the corresponding reviews.
	let profName;
	const profQuery = mysql.format('SELECT name FROM professor WHERE id = ?',
		req.params.profId);
	return pool.query(profQuery)
		.then((professor) => {
			if (!professor.length) throw new NotFoundError();

			profName = professor[0].name;
			const subjQuery = mysql.format(
				'SELECT teaching.prof_id, subject.acronym, subject.name, '
				+ 'avg(review.stars) AS avg, '
				+ 'count(review.reviewer) AS count FROM teaching '
				// Join with "subject" to get the name for each subject.
				+ 'INNER JOIN subject ON teaching.subj_acr = subject.acronym '
				// Join with "review" to get the vote count and average rating
				// for each professor/subject pair.
				+ 'LEFT JOIN review ON review.subj_acr = teaching.subj_acr '
				+ 'AND review.prof_id = teaching.prof_id '
				+ 'WHERE teaching.prof_id = ? '
				+ 'GROUP BY teaching.prof_id, teaching.subj_acr',
				req.params.profId,
			);
			// Fetch any reviews for the queried professor made by this user.
			// TODO: This can probably be included in the previous query. Let's
			// leave optimization for... someday?
			const reviewsQuery = mysql.format(
				'SELECT subj_acr, stars '
				+ 'FROM review WHERE prof_id = ? AND reviewer = ?',
				[req.params.profId, req.session.reviewerHash],
			);
			return Promise.all([pool.query(subjQuery), pool.query(reviewsQuery)]);
		})
		.then((results) => {
			const [subjects, reviewedItems] = results;
			const reviewed = reviewedItems.reduce((obj, item) => (
				{ ...obj, [item.subj_acr]: item.stars }), {});
			res.json({
				name: profName,
				profId: req.params.profId,
				subjects,
				reviewed,
			});
		})
		.catch(e => next(e));
};

module.exports.rateProfessor = (req, res, next) => {
	// Make sure that the provided rating is a valid integer and 1 <= rating <=
	// 5.
	const sanitizedRating = Math.round(parseInt(req.body.rating, 10));
	if (Number.isNaN(sanitizedRating) || sanitizedRating < 1 || sanitizedRating > 5) {
		throw new BadRequestError();
	}

	const query = mysql.format('INSERT INTO review VALUES (?, ?, ?, ?, NULL)',
		[req.params.profId, req.body.subject, sanitizedRating, req.session.reviewerHash]);

	return pool.query(query)
		.then(() => res.sendStatus(200))
		.catch(e => next(e));
};

module.exports.getSubjects = (req, res, next) => (
	pool.query('SELECT name, acronym FROM subject')
		.then(subjects => res.json({ subjects }))
		.catch(e => next(e))
);

module.exports.getSubjectDetails = (req, res, next) => {
	let subjName;
	const subjQuery = mysql.format('SELECT name FROM subject WHERE acronym = ?',
		req.params.subjAcr);
	return pool.query(subjQuery)
		.then((subject) => {
			if (!subject.length) throw new NotFoundError();

			subjName = subject[0].name;

			const profQuery = mysql.format('SELECT professor.id, professor.name, '
				+ 'avg(review.stars) AS avg, '
				+ 'count(review.reviewer) AS count FROM teaching '
				// Join with "professor" to get the name for each professor.
				+ 'INNER JOIN professor ON teaching.prof_id = professor.id '
				// Join with "review" to get the vote count and average rating for each
				// professor/subject pair.
				+ 'LEFT JOIN review ON review.subj_acr = teaching.subj_acr '
				+ 'AND review.prof_id = professor.id '
				+ 'WHERE teaching.subj_acr = ? '
				+ 'GROUP BY teaching.prof_id, teaching.subj_acr', req.params.subjAcr);

			const reviewsQuery = mysql.format(
				'SELECT prof_id, stars '
				+ 'FROM review WHERE subj_acr = ? AND reviewer = ?',
				[req.params.subjAcr, req.session.reviewerHash],
			);
			return Promise.all([pool.query(profQuery), pool.query(reviewsQuery)]);
		})
		.then((results) => {
			const [professors, reviewedItems] = results;
			const reviewed = reviewedItems.reduce((obj, item) => (
				{ ...obj, [item.prof_id]: item.stars }), {});
			res.json({
				name: subjName,
				professors,
				reviewed,
			});
		})
		.catch(e => next(e));
};
