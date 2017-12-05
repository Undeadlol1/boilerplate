import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'browser/redux/actions/actionHelpers'

const forumsUrl = process.env.API_URL + 'forums/'

export const actions = createActions({
  UNLOAD_FORUM: () => null,
  REMOVE_FORUM: id => id,
  TOGGLE_DIALOG: () => null,
  RECIEVE_FORUM: node => node,
  RECIEVE_FORUMS: nodes => nodes,
  UPDATE_FORUM: object => object,
  TOGGLE_FORUM_FETCHING: boolean => boolean,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a forum
 * @param {object} payload content url
 */
export const insertForum = payload => (dispatch, getState) => {
	return fetch(forumsUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			return dispatch(actions.recieveForum(response))
		})
}

/**
 * fetch forum using forum slug
 * @param {string} slug forum slug (optional)
 */
export const fetchForum = slug => (dispatch, getState) => {
	const state = getState()
	const forumSlug = slug || state.forum.get('slug')
	return fetch(
		forumsUrl + 'forum/' + forumSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			console.log('data: ', data);
			return dispatch(actions.recieveForum((data)))
		})
		.catch(err => console.error('fetchforum failed!', err))
}

/**
 * fetch forums using forum slug
 * @param {string} slug forum slug (optional)
 */
export const fetchForums = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const forumSlug = slug || state.forum.get('slug')

	return fetch(
		forumsUrl + forumSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveForum((data)))
		})
		.catch(err => console.error('fetchforum failed!', err))
}