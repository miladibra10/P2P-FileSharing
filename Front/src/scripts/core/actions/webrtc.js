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
    SET_USER_STATUS,
    SET_FILE_INFO,
    SET_RECEIVED,
    SET_SENT,
    SET_DOWNLOAD_LINK,
    SET_FILE,
    SET_RECEIVED_FILES,
} = ActionTypes



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
export function setFileInfo(fileInfo){
    return {
        type: SET_FILE_INFO,
        payload:{
            fileInfo: fileInfo 
        }
    }
}

export function setUserStatus(status){
    return {
        type: SET_USER_STATUS,
        payload: {
            status: status
        }
    }
}

export function setReceived(received) {
    return {
        type: SET_RECEIVED,
        payload: {
            received
        }
    }
}
export function setSent(sent) {
    return {
        type: SET_SENT,
        payload: {
            sent
        }
    }
}
export function setDownloadLink(downloadLink) {
    return {
        type: SET_DOWNLOAD_LINK,
        payload: {
            downloadLink
        }
    }
}
export function setFile(file) {
    return {
        type: SET_FILE,
        payload: {
            file
        }
    }
}

export function setReceivedFiles(receivedFiles,fileInfo) {
    return {
        type: SET_RECEIVED_FILES,
        payload: {
            files: [
            ...receivedFiles,
            fileInfo]
        }
    }
}

