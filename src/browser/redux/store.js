import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk' // TODO is it even used?
import rootReducer from './reducers/RootReducer'
// console.log('window', window)
// const reduxDevtools =   window && (process.env.NODE_ENV == 'development')
//                         ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                         : {}
                        
const store =   createStore(
                    rootReducer,
                    // reduxDevtools,
                    applyMiddleware(thunk) // TODO do i use this?
                ) // thunk, promise, // TODO add dev variable to redux devtools

export default store