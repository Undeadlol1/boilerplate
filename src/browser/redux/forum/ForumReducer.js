import isEmpty from 'lodash/isEmpty'
import { Map, List, fromJS } from 'immutable'

const forumStructure = 	{
							id: '',
							name: '',
							slug: '',
							UserId: '',
						}

export const initialState = fromJS({
							error: '',
							forums: {
								totalPages: 0,
								currentPage: 0,
								values: [],
							},
							threads: {
								totalPages: 0,
								currentPage: 0,
								values: [],
							},
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							// TODO: do i need this?
							searchIsActive: false,
							...forumStructure
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		case 'RECIEVE_FORUM':
			return state
				.merge(payload)
				.updateIn(['forums', 'values'], arr => {
					return isEmpty(payload)
						? arr
						: arr.push(Map(payload))
				})
				.merge({
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'RECIEVE_FORUMS':
			return state
				.mergeDeep({
					loading: false,
					forums: payload,
				})
		// push thread into "threads" array
		case 'RECIEVE_THREAD':
			return state
				.updateIn(['threads', 'values'], arr => {
					return isEmpty(payload)
						? arr
						: arr.push(Map(payload))
				})
		case 'UPDATE_FORUM':
			return state.mergeDeep(payload)
		case 'TOGGLE_DIALOG':
			return state.set('dialogIsOpen', !state.get('dialogIsOpen'))
		case 'UNLOAD_FORUM':
			return state
				.merge(forumStructure)
				.merge({forums: List()})
				.mergeDeep({
					loading: false,
					// finishedLoading: false,
					contentNotFound: false,
				})
		// remove forum from forums list
		case 'REMOVE_FORUM':
			return state
				.merge({
					forums: state
							.get('forums')
							.filter(forum => forum.get('id') !== payload)
				})
		default:
			return state
	}
}