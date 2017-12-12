import isEmpty from 'lodash/isEmpty'
import { Map, List, fromJS } from 'immutable'

// TODO: rework into using "fromJS" which converts better (this way many bugs in reducer can be avoided)

const moduleNameStructure =  {
							id: '',
							url: '',
							type: '',
							UserId: '',
							ModuleNameId: '',
							rating: '',
							provider: '',
							contentId: '',
						}

export const initialState = fromJS({
							error: '',
							moduleNames: {
								values: [],
								totalPages: 0,
								currentPage: 0,
							},
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							// TODO do i need this?
							searchIsActive: false,
							...moduleNameStructure
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		// case 'FETCHING_MODULENAME':
		// 	return state.merge({
		// 		loading: true,
		// 		finishedLoading: false,
		// 		contentNotFound: false,
		// 	})
		case 'RECIEVE_MODULENAME':
			return state
				.merge(payload)
				.updateIn(['moduleNames'], arr => {
					return isEmpty(payload)
						? arr
						: arr.push(Map(payload))
				})
				.merge({
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'RECIEVE_MODULENAMES':
			return state
				.mergeDeep({
					...payload[0],
					moduleNames: payload,
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'UPDATE_MODULENAME':
			return state.mergeDeep(payload)
		case 'TOGGLE_DIALOG':
			return state.set('dialogIsOpen', !state.get('dialogIsOpen'))
		case 'UNLOAD_MODULENAME':
			return state
				.merge(moduleNameStructure)
				.merge({moduleNames: List()})
				.mergeDeep({
					loading: false,
					// finishedLoading: false,
					contentNotFound: false,
				})
		// remove moduleName from moduleNames list
		case 'REMOVE_MODULENAME':
			return state
				.merge({
					moduleNames: state
							.get('moduleNames')
							.filter(moduleName => moduleName.get('id') !== payload)
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