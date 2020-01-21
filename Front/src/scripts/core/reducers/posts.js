import { ActionTypes } from '../actions/actionTypes'
import immutable from 'immutability-helper'

const initialState = {
    posts: [],
    postsLoadStatus: 'idle'
}

export default (state=initialState, action) => {
    switch(action.type){
        case 'persist/REHYDRATE': 
            return immutable(state, {
                postsLoadStatus: { $set :'idle' }
            })
        case ActionTypes.GET_ALL_POSTS_REQUEST:
            return immutable(state, {
                postsLoadStatus: { $set: 'running'}
            })
        case ActionTypes.GET_ALL_POSTS_SUCCESS:
            return immutable(state, {
                postsLoadStatus: { $set: 'loaded'},
                posts: { $set: [...state.posts, action.payload.posts]}
            })
        case ActionTypes.GET_ALL_POSTS_SUCCESS:
            return immutable(state, {
                postsLoadStatus: { $set: 'error'},
            })
        default : return state
    }
}