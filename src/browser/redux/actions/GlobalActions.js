import { checkStatus, parseJSON } from'./actionHelpers'
import { createAction } from 'redux-actions'
import selectn from 'selectn'

/**
 * toggle header
 * @param {Boolean} value value to set for headerIsShown
 */
export const toggleHeader = value => (dispatch, getState) => {
	// console.log('toggleHeader', value)
	dispatch({
		type: 'TOGGLE_HEADER',
		payload: typeof value == 'undefined' ? !selectn('global.headerIsShown', getState()) : value
	})
}
/**
 * toggle dialog
 * @param {Boolean} value value to set for loginIsOpen
 */
export const toggleSidebar = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_SIDEBAR',
		// sometimes event maybe passed to this function,
		// hence type checking
		payload: typeof value === 'boolean' ? value : !selectn('global.sidebarIsOpen', getState())
	})
}
/**
 * toggle controls
 * @param {Boolean} value value to set for controlsAreShown
 */
export const toggleControls = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_CONTROLS',
		payload: typeof value == 'undefined' ? !selectn('global.controlsAreShown', getState()) : value
	})
}
/**
 * @param {Boolean} value value to set for controlsAreShown
 */
export const openControls = value => (dispatch, getState) => { // TODO rename to "showControls"
	dispatch({
		type: 'TOGGLE_CONTROLS',
		payload: true
	})
}
/**
 * @param {Boolean} value value to set for controlsAreShown
 */
export const closeControls = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_CONTROLS',
		payload: false
	})
}

