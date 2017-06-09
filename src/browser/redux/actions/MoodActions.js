// @ts-check
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { toastr } from 'react-redux-toastr'
import { API_URL } from '../../../../config'

const moodsUrl = API_URL + 'moods/'

// export const { recieveMood, recieveMoods, fetchingInProgress, fetchingError } = createActions({
//   recieveMood: mood => mood, // object => object
//   recieveMoods: moods => moods,
//   fetchingInProgress: value => value,
//   fetchingError: reason => reason
// })

/**
 * @param {Array} moods
 */
export const recieveMoods = createAction('RECIEVE_MOODS')
/**
 * @param {Object} mood
 */
export const recieveMood = createAction('RECIEVE_MOOD')
/**
 * @param {Array} moods
 */
export const recieveSearchResult = createAction('RECIEVE_SEARCH_RESULT')
/**
 * @param {Boolean} value // TODO add toggle
 */
export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')
/**
 * @param {String} reason
 */
export const fetchingError = createAction('FETCHING_ERROR', reason => reason)
/**
 * @param {null}
 */
export const unloadMood = createAction('UNLOAD_MOOD')

export const fetchMoods = (pageNumber = 1) => dispatch => {
	dispatch(fetchingInProgress())
	fetch(moodsUrl + (pageNumber ? '/' + pageNumber : ''))
		.then(checkStatus)		
		.then(parseJSON)
		.then(data => {
			data.currentPage = pageNumber
			dispatch(recieveMoods((data)))
		})
		.catch(error => {
			console.error(error)
		})
}
/**
 * fetch mood by slug
 * @param {String} slug 
 */
export const fetchMood = slug => dispatch => {
	dispatch(fetchingInProgress())
	fetch(moodsUrl + 'mood/' + slug || '')
		.then(checkStatus)		
		.then(parseJSON)
		.then(mood => dispatch(recieveMood((mood))))
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