import { Map, List } from 'immutable'

export const initialState = Map({
							loading: false,
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		case 'TOGGLE_LOADING':
			const isLoading = state.get('loading')
			return state.set('loading', payload || !isLoading)
		default:
			return state
	}
}