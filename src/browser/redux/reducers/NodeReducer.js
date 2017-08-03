import isEmpty from 'lodash/isEmpty'
import { Map, List } from 'immutable'

const decisionStructure = Map({
								rating: '',
								UserId: '',
								NodeId: '',
								MoodId: '',
								vote: null,
								NodeRating: '',
								nextViewAt: '',
							})

const nodeStructure = 	Map({
							id: '',
							url: '',
							UserId: '',
							MoodId: '',
							rating: '',
							type: '',
							provider: '',
							contentId: '',
							Decision: decisionStructure.toJS()
						})
export const initialState = Map({
							nodes: List(),
							error: '',
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							searchIsActive: false, // TODO do i need this?
							searchedVideos: List(),
							...nodeStructure.toJS()
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		// case 'FETCHING_NODE':
		// 	return state.merge({
		// 		loading: true,
		// 		finishedLoading: false,
		// 		contentNotFound: false,
		// 	})
		case 'RECIEVE_NODE':
			return state
				.merge(payload)
				.merge({
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'RECIEVE_NODES':
			return state
				.mergeDeep({
					...payload[0],
					nodes: payload,
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'UPDATE_NODE':
			return state.mergeDeep(payload)
		case 'TOGGLE_DIALOG':
			return state.set('dialogIsOpen', !state.get('dialogIsOpen'))
		case 'UNLOAD_NODE':
			return state
				.merge(nodeStructure)
				.merge({nodes: List()})
				.mergeDeep({
					loading: false,
					// finishedLoading: false,
					contentNotFound: false,
				})
		// remove node from nodes list
		case 'REMOVE_NODE':
			return state
				.merge({
					nodes: state
							.get('nodes')
							.filter(node => node.get('id') !== payload)
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