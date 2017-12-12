import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'browser/redux/actions/actionHelpers'

const forumsUrl = process.env.API_URL + 'forums/'
const threadsUrl = process.env.API_URL + 'threads/'

export const actions = createActions({
  UNLOAD_FORUM: () => null,
  REMOVE_FORUM: id => id,
  TOGGLE_DIALOG: () => null,
  RECIEVE_FORUM: forum => forum,
  RECIEVE_FORUMS: forums => forums,
  RECIEVE_THREAD: thread => thread,
  UPDATE_FORUM: object => object,
  TOGGLE_FORUM_FETCHING: boolean => boolean,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a forum
 * @param {object} payload data to pass
 * @param {function} callback callback function
 */
export const insertForum = (payload, callback) => (dispatch, getState) => {
	return fetch(forumsUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.recieveForum(response))
			return callback && callback()
		})
}

/**
 * create a thread
 * @param {object} payload data to pass
 * @param {function} callback callback function
 */
export const insertThread = (payload, callback) => (dispatch, getState) => {
	return fetch(threadsUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then((response) => {
			dispatch(actions.recieveThread(response))
			return callback && callback()
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
			return dispatch(actions.recieveForum((data)))
		})
		.catch(err => console.error('fetchforum failed!', err))
}

/**
 * fetch forums
 * @param {number} [page=1] forums page (optional)
 */
export const fetchForums = (page = 1) => (dispatch, getState) => {
	return fetch(forumsUrl + page)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => dispatch(actions.recieveForums((data))))
		.catch(err => console.error('fetchForums failed!', err))
}