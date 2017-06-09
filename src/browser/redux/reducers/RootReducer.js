import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as toastr } from 'react-redux-toastr'

import global from './GlobalReducer'
import user from './UserReducer'
import mood from './MoodReducer'
import node from './NodeReducer'

export default combineReducers({
    global,
    user,
    mood,
    node,
    form,
    toastr,
})