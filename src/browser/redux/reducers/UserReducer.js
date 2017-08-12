import isEmpty from 'lodash/isEmpty'
import { Map, fromJS } from 'immutable'
import { emptyMoodsObject } from 'browser/redux/reducers/MoodReducer'

const emptyProfileObject = {
	id: '',
	language: '',
	UserId: '',
	// to display <MoodsList /> in <UserPage />
	...emptyMoodsObject,
}

const emptyLocalObject = {
	id: '',
	username: '',
	email: '',
	UserId: '',
}

const emptyVkObject = {
	id: '',
	image: '',
	UserId: '',
	username: '',
	displayName: '',
}

const emptyTwitterObject = {
	id: '',
	image: '',
	UserId: '',
	username: '',
	displayName: '',
}

const emptyUserObject = {
	id: undefined,
	image: '',
	displayName: '',
	Vk: emptyVkObject,
	Twitter: emptyTwitterObject,
	Profile: emptyProfileObject,
	Local: emptyLocalObject,
}

export const initialState = fromJS({
	...emptyUserObject,
	loading: false,
	loginIsOpen: false,
	fetchedUser: emptyUserObject,
})

export default (state = initialState, { type, payload }) => {
	switch(type) {
		case 'FETCHING_USER':
			return state.set('loading', true)
		case 'RECIEVE_CURRENT_USER':
			return state.mergeDeep({
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