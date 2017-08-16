import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'

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
 * @param {Object} payload content url
 */
export const insertModuleName = payload => (dispatch, getState) => {
	return fetch(nodesUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			return dispatch(actions.recieveModuleName(response))
		})
}

/**
 * fetch moduleName using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchModuleName = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	dispatch(actions.fetchingModuleName())

	return fetch(
		nodesUrl + moodSlug + '/' + nodeId,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveModuleName((data)))
		})
		.catch(err => console.error('fetchmoduleName failed!', err))
}

/**
 * fetch moduleNames using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchModuleNames = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	dispatch(actions.fetchingModuleName())

	return fetch(
		nodesUrl + moodSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveModuleName((data)))
		})
		.catch(err => console.error('fetchmoduleName failed!', err))
}