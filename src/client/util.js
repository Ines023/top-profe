/* eslint-disable quote-props */
/**
 * Error handler specifically designed for AJAX requests made to the backend's
 * REST API.
 */

import toast from 'react-hot-toast';

export function ajaxErrHandler(res) {
	// Redirect to the Single Sign-On (SSO) login page if the
	// request was unauthorized.
	if (res.status === 401) {
		res.json()
			.then(() => {
				window.location.href = '/login';
				return null;
			});
		return res;
	}

	if (res.status === 400 || res.status === 403 || res.status === 404) {
		res.json()
			.then((jsonResponse) => {
				if (jsonResponse.code === 'excluded_user') window.location.href = `/${res.status}`;
				else if (jsonResponse.code === 'non_active_user') window.location.href = '/';
				else toast.error(jsonResponse.message);
				return null;
			});
		return res;
	}

	if (res.status === 409) {
		res.json()
			.then((jsonResponse) => {
				toast(jsonResponse.message, {
					icon: '⚠️',
				});
				return null;
			});
		return res;
	}

	// Redirect to the generic error view on 500s.
	if (res.status === 500) {
		window.location.href = `/${res.status}`;
		res.json()
			.then((jsonResponse) => {
				toast.error(jsonResponse.message);
				return null;
			});
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


/**
 * Send a PUT request to the desired URL, with the body as a JSON-encoded
 * content.
 */
export function fetchPut(url, body) {
	return fetch(url, {
		method: 'PUT',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'Referer': window.location.href,
		},
	})
		.then(ajaxErrHandler);
}
