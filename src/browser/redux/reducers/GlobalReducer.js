import { Map } from 'immutable'
import isBoolean from 'lodash/isBoolean'

// TODO this is a mess, reworking needed
// TODO rename to UiReducer
export const initialState =	Map({
								headerIsShown: true,
								sidebarIsOpen: false,
								playerIsReady: false,
								controlsAreShown: false,
							})

export default (state = initialState, { type, payload }) => {
	/**
	 * toggle value in state
	 * @param {any} selector value to update
	 * @returns new state with updated field
	 */
	function toggleElement(selector) {
		// event could passed to this function
		const value = 	isBoolean(payload)
						? payload
						: !state.get(selector)
		return state.set(selector, value)
	}
	switch(type) {
		case 'TOGGLE_HEADER':
			return toggleElement('headerIsShown')
		case 'TOGGLE_SIDEBAR':
			return toggleElement('sidebarIsOpen')
		case 'TOGGLE_CONTROLS':
			return toggleElement('controlsAreShown')
		case 'TOGGLE_PLAYER_IS_READY':
			return toggleElement('playerIsReady')
		default:
			return state
	}
}