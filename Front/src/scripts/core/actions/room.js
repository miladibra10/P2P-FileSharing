import  {ActionTypes} from "./actionTypes";

const {
    CONNECTED_ROOM,
    USER_ADDED_ROOM,
    USER_REMOVED_ROOM,
    DISCONNECTED_ROOM,
    USER_CHANGED,
    SEARCH_USER_REQUEST,
} = ActionTypes;

export function connectedRoom () {
    return {
        type: CONNECTED_ROOM,
        payload: {}
    }
}
export function userAddedRoom () {
    return {
        type: USER_ADDED_ROOM,
        payload: {}
    }
}
export function userRemovedRoom () {
    return {
        type: USER_REMOVED_ROOM,
        payload: {}
    }
}
export function disconnectedRoom () {
    return {
        type: DISCONNECTED_ROOM,
        payload: {}
    }
}
export function userChanged () {
    return {
        type: USER_CHANGED,
        payload: {}
    }
}

export function searchUser(keyword) {
    return {
        type: SEARCH_USER_REQUEST,
        payload: { keyword }
    }
}