import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { createAction } from 'redux-actions'
import selectn from 'selectn'
import { API_URL } from '../../../../config'

const authUrl = API_URL + 'auth/'
const usersUrl = API_URL + 'users/'

/**
 * dispatch succesfully fetched user object
 * @param {Object} user object
 */
export const recieveCurrentUser = createAction('RECIEVE_CURRENT_USER', user => user)

export const removeCurrentUser = createAction('REMOVE_CURRENT_USER')

export const recieveFetchedUser = createAction('RECIEVE_FETCHED_USER', user => user)

export const removeFetchedUser = createAction('REMOVE_FETCHED_USER')

export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')

export const fetchingError = createAction('FETCHING_ERROR', error => error)

export const fetchCurrentUser = () => dispatch => {
	dispatch(fetchingInProgress())
	fetch(authUrl + 'current_user', {credentials: 'same-origin'})
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('fetchCurrentUser failed!', err)) // TODO add client side error handling
}

export const logoutCurrentUser = () => dispatch => {
	fetch(authUrl + 'logout', {credentials: 'same-origin'})
		.then(checkStatus)
		.then(() => dispatch(removeCurrentUser())) // TODO refactor without arrow function?
		.catch(err => console.error('logoutCurrentUser failed!', err))
}
/**
 * @param {Boolean} value value to set for loginIsOpen
 */
export const toggleLoginDialog = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_LOGIN_DIALOG',
		payload: !getState().user.get('loginIsOpen')
	})
}

export const fetchUser = username => dispatch => {
	dispatch(fetchingInProgress())
	fetch(`${usersUrl}user/${username}`)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveFetchedUser((user))))
		.catch(err => console.error('fetchUser failed!', err)) // TODO add client side error handling
}
/**
 * update user profile
 * @param {String} username user identifier
 * @param {Object} body profile attributes to update
 */
export const updateUser = (username, body) => dispatch => {
	// dispatch(fetchingInProgress())
	fetch(
		`${usersUrl}user/${username}`,
		headersAndBody({...body}, 'PUT')
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('updateUser failed!', err))
}