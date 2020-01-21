import { ActionTypes } from './actionTypes'

export function getAllPosts() {
    return {
        type: ActionTypes.GET_ALL_POSTS_REQUEST
    }
}

export function createNewPost(post, userID) {
    return {
        type: ActionTypes.CREATE_NEW_POST_REQUEST,
        payload: {post, userID}
    }
}

export function createUser() {
    return {
        type: ActionTypes.CREATE_USER
    }
}