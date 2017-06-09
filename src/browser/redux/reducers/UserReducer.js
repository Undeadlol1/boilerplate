import { isEmpty } from 'lodash'
import { Map } from 'immutable'

const emptyProfileObject = Map({
	id: '',
	language: '',
	UserId: '',
})

const emptyUserObject = Map({
	id: '',
	image: '',
	username: '',
	vk_id: '',
	facebook_id: '',
	twitter_id: '',
	Profile: emptyProfileObject,
})

const initialState = Map({
	...emptyUserObject,
	loginIsOpen: false,
	loading: false,
	fetchedUser: emptyUserObject
})

export default (state = initialState, { type, payload }) => {
	switch(type) {
		case 'FETCHING_IN_PROGRESS':
			return state.set('loading', true)
		case 'RECIEVE_CURRENT_USER':
			return state.merge({
				...payload,
				loading: false,
				loginIsOpen: isEmpty(payload) && state.get('loading') && state.get('loginIsOpen')
			})
		case 'RECIEVE_FETCHED_USER':
			return state.mergeDeep({
				loading: false,				
				fetchedUser: payload
			})
		case 'REMOVE_FETCHED_USER':
			return state.mergeDeep({
				fetchedUser: emptyUserObject
			})
		case 'REMOVE_CURRENT_USER':
			return state.merge(emptyUserObject)
		case 'TOGGLE_LOGIN_DIALOG':
			return state.set('loginIsOpen', payload)
		default:
			return state
	}
}