import { createAction, createActions } from 'redux-actions'

export const actions = createActions({
	/**
	 * @param {Boolean} payload value to set for headerIsShown
	 */
	TOGGLE_HEADER: boolean => boolean,
	/**
	 * @param {Boolean} payload value to set for sidebarIsOpen
	 */
	TOGGLE_SIDEBAR: boolean => boolean,
	/**
	 * @param {Boolean} payload value to set for controlsAreShown
	 */
	TOGGLE_CONTROLS: boolean => boolean,
})