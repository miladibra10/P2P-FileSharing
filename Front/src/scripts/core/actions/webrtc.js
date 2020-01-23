import { ActionTypes } from './actionTypes'
const {
    CONNECT_ROOM_SUCCESS,
    DISCONNECT_ROOM,
    ADD_USER_TO_ROOM,
    REMOVE_USER_FROM_ROOM,
    USER_CHANGE_ROOM,
    INCOMING_PEER_CONNECTION_P2P,
    INCOMING_DC_CONNECTION_P2P,
    INCOMING_DC_CONNECTION_ERROR,
    OUTGOING_DC_CONNECTION,
    OUTGOING_DC_CONNECTION_ERROR,
    OUTGOING_PEER_CONNECTION,
    DISCONNECTED,
    FILE_RECEIVED,
    INFO,
    FILE_CANCELED,
    RESPONSE,
    FILE_SENT,
} = ActionTypes


export function connectRoomSuccess() {
    return {
        type: CONNECT_ROOM_SUCCESS,
        payload: {}
    }
}


export function disconnectRoom() {
    return {
        type: DISCONNECT_ROOM,
        payload: {}
    }
}

export function addUserToRoom() {
    return {
        type: ADD_USER_TO_ROOM,
        payload: {}
    }
}

export function removeUserFromRoom() {
    return {
        type: REMOVE_USER_FROM_ROOM,
        payload: {}
    }
}

export function userChangeRoom() {
    return {
        type: USER_CHANGE_ROOM,
        payload: {}
    }
}

export function incommingPeerConnectionP2P() {
    return {
        type: INCOMING_PEER_CONNECTION_P2P,
        payload: {}
    }
}

export function incommingDCConnectionP2P() {
    return {
        type: INCOMING_DC_CONNECTION_P2P,
        payload: {}
    }
}

export function incommingDCConnectionError() {
    return {
        type: INCOMING_DC_CONNECTION_ERROR,
        payload: {}
    }
}

export function outgoingDCConnection() {
    return {
        type: OUTGOING_DC_CONNECTION,
        payload: {}
    }
}

export function outgoingDCConnectionError() {
    return {
        type: OUTGOING_DC_CONNECTION_ERROR,
        payload: {}
    }
}

export function outgoingPeerConnection() {
    return {
        type: OUTGOING_PEER_CONNECTION,
        payload: {}
    }
}

export function disconnected() {
    return {
        type: DISCONNECTED,
        payload: {}
    }
}

export function fileReceived() {
    return {
        type: FILE_RECEIVED,
        payload: {}
    }
}

export function info() {
    return {
        type: INFO,
        payload: {}
    }
}

export function fileCanceled() {
    return {
        type: FILE_CANCELED,
        payload: {}
    }
}

export function response() {
    return {
        type: RESPONSE,
        payload: {}
    }
}

export function fileSent() {
    return {
        type: FILE_SENT,
        payload: {}
    }
}
