class BadRequestError extends Error {}
module.exports.BadRequestError = BadRequestError;

class LimitedUserError extends Error {}
module.exports.LimitedUserError = LimitedUserError;

class NonActiveUserError extends Error {}
module.exports.NonActiveUserError = NonActiveUserError;

class ExcludedUserError extends Error {}
module.exports.ExcludedUserError = ExcludedUserError;

class NotFoundError extends Error {}
module.exports.NotFoundError = NotFoundError;

class UnauthorizedError extends Error {}
module.exports.UnauthorizedError = UnauthorizedError;

// The global error handler.
// Express requires the 4 arguments to be present in order to identify this as
// an error handler.
// eslint-disable-next-line no-unused-vars
module.exports.globalErrorHandler = (err, req, res, next) => {
	if (err instanceof BadRequestError
		// Error type for SQL queries that introduce duplicate values on keys
		// that should be unique.
		|| err.code === 'ER_DUP_ENTRY') {
		return res.status(400).json({
			code: 'bad_request',
			message: 'Petición mal formada.',
		});
	}

	if (err instanceof LimitedUserError) {
		return res.status(403).json({
			code: 'limited_user',
			message: 'No tienes permisos para realizar esta acción.',
		});
	}

	if (err instanceof ExcludedUserError) {
		return res.status(403).json({
			code: 'excluded_user',
			message: 'Tu usuario se encuentra excluído de la aplicación.',
		});
	}

	if (err instanceof NonActiveUserError) {
		return res.status(403).json({
			code: 'non_active_user',
			message: 'Tu usuario no se encuentra activado.',
		});
	}

	if (err instanceof NotFoundError) {
		return res.status(404).json({
			code: 'not_found',
			message: 'Página no encontrada.',
		});
	}

	if (err instanceof UnauthorizedError) {
		return res.status(401).json({
			code: 'unauthorized',
			message: 'Se requiere inicio de sesión.',
		});
	}

	// Some other unknown error.
	res.status(500).json({
		code: 'internal_server_error',
		message: 'Error interno del servidor.',
	});
	return next(err); // Let it pass the middleware so Sentry can catch it.
};
