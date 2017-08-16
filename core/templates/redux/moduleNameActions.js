import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'

const nodesUrl = process.env.API_URL + 'moduleNames/'

export const actions = createActions({
  UNLOAD_NODE: () => null,
  REMOVE_NODE: id => id,
  TOGGLE_DIALOG: () => null,
  RECIEVE_NODE: node => node,
  RECIEVE_NODES: nodes => nodes,
  UPDATE_NODE: object => object,
  TOGGLE_NODE_FETCHING: boolean => boolean,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a moduleName
 * @param {Object} payload content url
 */
export const insertNode = payload => (dispatch, getState) => {
	return fetch(nodesUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			return dispatch(actions.recieveNode(response))
		})
}

/**
 * fetch moduleName using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchmoduleName = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	dispatch(actions.fetchingNode())

	return fetch(
		nodesUrl + moodSlug + '/' + nodeId,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveNode((data)))
		})
		.catch(err => console.error('fetchmoduleName failed!', err))
}

/**
 * fetch fetchmoduleNames using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchmoduleNames = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	dispatch(actions.fetchingNode())

	return fetch(
		nodesUrl + moodSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveNodes((data)))
		})
		.catch(err => console.error('fetchmoduleName failed!', err))
}