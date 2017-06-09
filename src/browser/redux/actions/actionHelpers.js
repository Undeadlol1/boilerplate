// import React from 'react'
import { isObject } from 'lodash'
import { toastr } from 'react-redux-toastr'
import { FormattedMessage } from 'react-intl';

// TODO add comments
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    let message = ''
    error.response = response
    if (response.statusText == 'Unauthorized') message = 'Please login'
    const toastrType = 'warning';
			const toastrOptions = {
			  icon: toastrType,
			  status: toastrType,
        showCloseButton: false
			}
    // toastr.error(<FormattedMessage id="error_accured" />, message || response.statusText, toastrOptions)
    toastr.error('Error accured!', message || response.statusText, toastrOptions)
    console.error(error);
    console.info(response);
  }
}

// TODO add typings
export function parseJSON(response) {
  try {
    return response.json()
  } catch (error) {
    console.error(error);
    return null
  }
}
/**
 * apply boilerplate headers and body to request
 * @export
 * @param {Object} payload request data
 * @param {String} method request method ('PUT', 'POST', 'GET', 'DELETE')
 * @returns {Object} ddssd
 */
export function headersAndBody(payload, method = 'POST') {
  // const body = isObject(payload) ? 
  return {
		method: method.toUpperCase(),
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(payload),
        // isObject(payload) ? payload : {[payload]: payload}
      // ),
	}
}
