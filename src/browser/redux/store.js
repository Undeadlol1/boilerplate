import thunk from 'redux-thunk'
import { fromJS } from 'immutable'
import promiseMiddleware from 'redux-promise'
import rootReducer, { initialState as stateWithoutPlugins } from './reducers/RootReducer'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'

// create enhancer for redux-devtools
// TODO check if it's not actuallly available in production
const composeEnhancers = composeWithDevTools({})
/**
 * create initial state
 * Server side it's undefined and is calculated while rendering
 * then it is stored in 'window.__data'
 * On client side it's picked up from that object
 * @returns initial state
 */
function getInitialState() {
    if (process.env.SERVER) return undefined
    else {
        // Data cannot be saved in template while being immutale.
        // Pick it up, and form immutable state again
        let state = {}
        const immutableKeys = Object.keys(stateWithoutPlugins)
        Object
         // in testing window.__data is undefined
        .keys(window.__data || {})
        .map(key => {
            // TODO comment this or delete
            // state[key] = immutableKeys.includes(key) ? fromJS(window.__data[key]) : window.__data[key]
            state[key] = fromJS(window.__data[key])
        })
        // example: state = {
        //     something: Map(),
        //     otherthing: Map(),
        // }
        return state
    }
}

const store =   createStore(
                    rootReducer,
                    getInitialState(),
                    composeEnhancers(applyMiddleware(thunk, promiseMiddleware)),
                )

export default store