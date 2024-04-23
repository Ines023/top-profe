/* eslint-disable quote-props */
/**
 * Error handler specifically designed for AJAX requests made to the backend's
 * REST API.
 */
export function ajaxErrHandler(res) {
	// Redirect to the Single Sign-On (SSO) login page if the
	// request was unauthorized.
	if (res.status === 401) {
		return res.json()
			.then(() => {
				window.location.href = '/login';
				return null;
			});
	}

	// Redirect to the generic error view on 404s and 500s.
	if (res.status === 404 || res.status === 500) {
		window.location.href = `/${res.status}`;
		return null;
	}

	// Continue with the promise chain otherwise.
	return res;
}

/**
 * Send a GET request to the desired URL.
 */
export function fetchGet(url) {
	return fetch(url, {
		headers: {
			'Referer': window.location.href,
		},
	})
		.then(ajaxErrHandler);
}

/**
 * Send a DELETE request to the desired URL, with the body as a JSON-encoded
 * content.
 */
export function fetchDelete(url, body) {
	return fetch(url, {
		method: 'DELETE',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'Referer': window.location.href,
		},
	})
		.then(ajaxErrHandler);
}

/**
 * Send a POST request to the desired URL, with the body as a JSON-encoded
 * content.
 */
export function fetchPost(url, body) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'Referer': window.location.href,
		},
	})
		.then(ajaxErrHandler);
}
