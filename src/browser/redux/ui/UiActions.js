import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'browser/redux/actions/actionHelpers'

export const actions = createActions({
	TOGGLE_LOADING: value => value,
})

/**
 * toggle global page loading icon
 * @param {boolean} [boolean] value to set on renderer
 */
export const togglePageLoading = boolean => (dispatch, getState) => {
	return dispatch(actions.toggleLoading(boolean))
}