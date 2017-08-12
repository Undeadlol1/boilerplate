// @ts-check
import { createAction } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { toastr } from 'react-redux-toastr'

const moodsUrl = String(process.env.API_URL) + 'moods/'

// export const { recieveMood, recieveMoods, fetchingInProgress, fetchingError } = createActions({
//   recieveMood: mood => mood, // object => object
//   recieveMoods: moods => moods,
//   fetchingInProgress: value => value,
//   fetchingError: reason => reason
// })

/**
 * @param {object} moods moods data (ex. pages, moods array)
 */
export const recieveMoods = createAction('RECIEVE_MOODS')
/**
 * @param {object} mood
 */
export const recieveMood = createAction('RECIEVE_MOOD')
/**
 * @param {array} moods
 */
export const recieveSearchResult = createAction('RECIEVE_SEARCH_RESULT')
/**
 * @param {boolean} value // TODO add toggle
 */
export const fetchingInProgress = createAction('FETCHING_MOOD')
/**
 * @param {string} reason
 */
export const fetchingError = createAction('FETCHING_ERROR', reason => reason)
/**
 * @param {null}
 */
export const unloadMood = createAction('UNLOAD_MOOD')

/**
 *
 * @param {string} selector route api specifier (popular, new, random)
 * @param {number} pageNumber
 */
export const fetchMoods = (selector = 'popular', pageNumber = 1) => dispatch => {
	dispatch(fetchingInProgress())
	return fetch(moodsUrl + selector + (pageNumber ? '/' + pageNumber : ''))
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			data.currentPage = pageNumber
			data.selector = selector
			// TODO
			return dispatch(recieveMoods(data))
		})
		.catch(error => {
			console.error(error)
		})
}
/**
 * fetch mood by slug
 * @param {string} slug
 */
export const fetchMood = (slug) => dispatch => {
	dispatch(fetchingInProgress())
	return fetch(moodsUrl + 'mood/' + slug || '')
		.then(checkStatus)
		.then(parseJSON)
		.then(mood => {
			return dispatch(recieveMood((mood)))
		})
}
/**
 * create mood
 * @param {String} name mood name
 */
export const insertMood = (name, callback) => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/api/moods', headersAndBody({ name }))
		.then(checkStatus)
		.then(parseJSON)
		.then(({slug}) => {
			callback && callback(slug)
			return slug
		})
		.then(() => dispatch(fetchMoods()))
}
/**
 * search moods by name
 * @param {String} name
 */
export const findMoods = name => dispatch => {
	dispatch(fetchingInProgress())
	fetch(moodsUrl + 'search/' + name)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			console.log('moods have been found!', data)
			return data
		})
		.then(data => dispatch(recieveSearchResult((data))))
}

export const toggleDialog = () => dispatch => {
	dispatch({type: 'TOGGLE_MOODS_INSERT_DIALOG'})
}