import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'browser/redux/actions/actionHelpers'

const moduleNamesUrl = process.env.API_URL + 'moduleNames/'

export const actions = createActions({
  UNLOAD_MODULENAME: () => null,
  REMOVE_MODULENAME: id => id,
  TOGGLE_DIALOG: () => null,
  RECIEVE_MODULENAME: node => node,
  RECIEVE_MODULENAMES: nodes => nodes,
  UPDATE_MODULENAME: object => object,
  TOGGLE_MODULENAME_FETCHING: boolean => boolean,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a moduleName
 * @param {object} payload content url
 */
export const insertModuleName = payload => (dispatch, getState) => {
	return fetch(moduleNamesUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			return dispatch(actions.recieveModuleName(response))
		})
}

/**
 * fetch moduleName using moduleName slug
 * @param {string} slug moduleName slug (optional)
 */
export const fetchModuleName = slug => (dispatch, getState) => {
	const moduleNameSlug = slug || getState().moduleName.get('slug')

	return fetch(moduleNamesUrl + 'moduleName/' + moduleNameSlug,)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveModuleName((data)))
		})
		.catch(err => console.error('fetchmoduleName failed!', err))
}

/**
 * fetch moduleNames
 * @param {number} [page=1] moduleNames page (optional)
 */
export const fetchModuleNames = (page=1) => (dispatch, getState) => {
	return fetch(moduleNamesUrl + page)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => dispatch(actions.recieveModuleNames((data))))
		.catch(err => console.error('fetchmoduleName failed!', err))
}