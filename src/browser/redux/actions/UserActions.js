import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { createAction, createActions } from 'redux-actions'
import { SubmissionError } from 'redux-form'
import selectn from 'selectn'
import { translate } from 'browser/containers/Translator'

const authUrl = process.env.API_URL + 'auth/'
const usersUrl = process.env.API_URL + 'users/'

export const actions = createActions({
	/**
	 * dispatch succesfully fetched user object
	 * @param {Object} user object
	 */
	RECIEVE_CURRENT_USER: user => user,
	REMOVE_CURRENT_USER: () => {},
	RECIEVE_FETCHED_USER: user => user,
	REMOVE_FETCHED_USER: () => {},
	FETCHING_USER: () => {},
	TOGGLE_LOGIN_DIALOG: boolean => boolean,
})
const { fetchingUser, recieveFetchedUser, removeCurrentUser, recieveCurrentUser } = actions

export const loginUser = (payload, callback) => dispatch => {
	return fetch(authUrl + 'login', headersAndBody(payload))
			.then(res => {
				console.log('res', res);
				if (res.status != 200) {
					return res
						.text()
						.then(text => {
							let password,
								username
							if (text == 'Incorrect password') password = translate('incorrent_password')
							if (text == 'User not exists') password = translate('user_does_not_exists')
							throw new SubmissionError({username, password})
						})
				}
				else return res
							.json()
							.then(user => {
								// reset form
								callback && callback()
								dispatch(recieveCurrentUser((user)))
							})
			})
}

export const createUser = (payload, callback) => dispatch => {
	return fetch(authUrl + 'signup', headersAndBody(payload))
			.then(res => {
				if (res.status != 200) {
					return res
						.text()
						.then(text => {
							let email,
								username
							if (text == 'user already exists') {
								email = translate('user_already_exists')
								username = translate('user_already_exists')
							}
							throw new SubmissionError({username: text, email: text})
						})
				}
				else return res
							.json()
							.then(user => {
								// reset form
								callback && callback()
								dispatch(recieveCurrentUser((user)))
							})
			})
}

//
export const fetchCurrentUser = () => dispatch => {
	dispatch(fetchingUser())
	return fetch(authUrl + 'current_user', {credentials: 'same-origin'})
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('fetchCurrentUser failed!', err)) // TODO add client side error handling
}

// TODO rename this to 'logoutUser'
export const logoutCurrentUser = () => dispatch => {
	return fetch(authUrl + 'logout', {credentials: 'same-origin'})
			.then(() => dispatch(removeCurrentUser())) // TODO refactor without arrow function?
			.catch(err => console.error('logoutCurrentUser failed!', err))
}
/**
 * @param {Boolean} value value to set for loginIsOpen
 */
export const toggleLoginDialog = value => (dispatch, getState) => {
	dispatch(
		actions.toggleLoginDialog(
			value || !getState().user.get('loginIsOpen')
		)
	)
}

export const fetchUser = username => dispatch => {
	dispatch(fetchingUser())
	return fetch(`${usersUrl}user/${username}`)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveFetchedUser((user))))
		.catch(err => console.error('fetchUser failed!', err)) // TODO add client side error handling
}
/**
 * update user profile
 * @param {UserId} UserId user identifier
 * @param {object} body profile attributes to update
 */
export const updateUser = (UserId, body) => dispatch => {
	// dispatch(fetchingUser())
	return fetch(
		`${usersUrl}user/${UserId}`,
		headersAndBody({...body}, 'PUT')
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('updateUser failed!', err))
}