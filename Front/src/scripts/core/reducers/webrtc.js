import { ActionTypes } from '../actions/actionTypes'
import immutable from 'immutability-helper'

const initialState = {
    status: null,
    fileInfo: {
        type: null,
        size: 0,
        name: null
    }
}

export default (state=initialState, action) => {
    switch(action.type){
        case ActionTypes.SET_USER_STATUS:
            return immutable(state, {
                status: {$set: action.payload.status}
            })
        case ActionTypes.SET_FILE_INFO:
            return immutable(state, {
                fileInfo :{$set: action.payload.fileInfo}   
            })
        default : return state
    }
}