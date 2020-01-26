import { ActionTypes } from '../actions/actionTypes'
import immutable from 'immutability-helper'

const initialState = {
    status: null,
    fileInfo: {
        type: null,
        size: 0,
        name: null
    },
    downloadLink: 0,
    received: 0,
    sent: 0,
    file: null,
    receivedFiles: []
}

export default (state=initialState, action) => {
    switch(action.type){
        case ActionTypes.SET_USER_STATUS:
            return immutable(state, {
                status: {$set: action.payload.status}
            });
        case ActionTypes.SET_FILE_INFO:
            return immutable(state, {
                fileInfo :{$set: action.payload.fileInfo}   
            });
        case ActionTypes.SET_RECEIVED:
            return immutable(state, {
                received :{$set: action.payload.received}
            });
        case ActionTypes.SET_SENT:
            return immutable(state, {
                sent :{$set: action.payload.sent}
            });
        case ActionTypes.SET_DOWNLOAD_LINK:
            return immutable(state, {
                downloadLink: {$set: action.payload.downloadLink}
            });
        case ActionTypes.SET_FILE:
            return immutable(state, {
                file: {$set: action.payload.file}
            });
        case ActionTypes.SET_RECEIVED_FILES:
            return immutable(state, {
                receivedFiles: {$set: action.payload.files}
            });
        default : return state
    }
}