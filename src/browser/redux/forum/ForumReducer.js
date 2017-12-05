import isEmpty from 'lodash/isEmpty'
import { Map, List } from 'immutable'

const forumStructure = 	Map({
							id: '',
							name: '',
							slug: '',
							UserId: '',
						})

export const initialState = Map({
							error: '',
							forums: List(),
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							searchIsActive: false, // TODO do i need this?
							searchedVideos: List(),
							...forumStructure.toJS()
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		// case 'FETCHING_FORUM':
		// 	return state.merge({
		// 		loading: true,
		// 		finishedLoading: false,
		// 		contentNotFound: false,
		// 	})
		case 'RECIEVE_FORUM':
			return state
				.merge(payload)
				.updateIn(['forums'], arr => {
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
					...payload[0],
					forums: payload,
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
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
		case 'RECIEVE_SEARCHED_VIDEOS':
			return state.merge({
				searchIsActive: false,
				searchedVideos: payload
			})
		default:
			return state
	}
}