import {databaseRef} from "./firebase";
import {store} from "../store";
import {setUserStatus, setFileInfo, setReceived, setSent, setDownloadLink} from '../actions/webrtc';
import {encode, decode} from "base64-arraybuffer"

function getStatus(){
    return store.getState().webrtc.status;
}
function getFileInfo() {
    return store.getState().webrtc.fileInfo;
}
function getFile() {
    return store.getState().webrtc.file;
}

function setLink(downloadLink) {
    store.dispatch(setDownloadLink(downloadLink))
}
function changeStatus(status){
    store.dispatch(setUserStatus(status))
}

function changeFileInfo(fileInfo){
    store.dispatch(setFileInfo(fileInfo.data))
}
export function onopen() {
    console.log("Connected to the signaling server");
    initialize();
};

function send(message) {
    console.log('sending', message);
}

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");
var candidates = [];
var receivedBuffer = [];
var receivedSize = 0;
var receivedFile = null;
function initialize() {
    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
        iceCandidatePoolSize: 1,
    };

    peerConnection = new RTCPeerConnection(configuration, {
        optional : [
            {
            RtpDataChannels :true
        }
        ]
    });

    peerConnection.onicecandidate = function(event) {
        console.log('new candidate is ready');
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
            candidates.push(event.candidate)
        }
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable : true
    });
    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("received message: ", event, event.type, event.data);
        try {
            const data = JSON.parse(event.data);
            if(data.type === 'file-info'){
                console.log("received file-info: ", data);
                changeStatus('file-info-received');
                changeFileInfo(data)
            }
            if(data.type === 'file-acceptance'){
                console.log("received acceptance: ", data);
                if(data.data){
                    changeStatus('sending');
                    sendFile(getFile())
                } else {
                    changeStatus('idle');
                }
            }
        } catch (e) {
            console.log("KIIIR");
            console.log(e);
            receivedBuffer.push(event.data);
            receivedSize += event.data.byteLength;
            setReceived(receivedSize);

            if (receivedSize === getFileInfo().size) {
                receivedFile = new Blob(receivedBuffer);
                receivedBuffer = [];
                setLink(URL.createObjectURL(receivedFile))
                changeStatus('idle');
                setReceived(0);
                receivedSize=0;
                console.log('finished receiving file', URL.createObjectURL(receivedFile))
            }
        }


        // if(parsedEvent.type === 'file'){
        //     console.log("KIIIR")
        //     receivedBuffer.push(parsedEvent.data);
        //     receivedSize += parsedEvent.data.byteLength;
        //     setReceived(receivedSize);
        //
        //     if (receivedSize === getFileInfo().size) {
        //         receivedFile = new Blob(receivedBuffer);
        //         receivedBuffer = [];
        //         setLink(URL.createObjectURL(receivedFile))
        //         changeStatus('idle');
        //         setReceived(0);
        //         receivedSize=0;
        //         console.log('finished receiving file', URL.createObjectURL(receivedFile))
        //     }
        // }
        // else if (event.type) {
        //
        //     const data = JSON.parse(event.data);
        //     if(data.type === 'file-info'){
        //         console.log("received file-info: ", data);
        //         changeStatus('file-info-received');
        //         changeFileInfo(data)
        //     }
        //     if(data.type === 'file-acceptance'){
        //         console.log("received acceptance: ", data);
        //         if(data.data){
        //             changeStatus('sending');
        //             sendFile(getFile())
        //         } else {
        //             changeStatus('idle');
        //         }
        //     }
        // }

    };

    dataChannel.onclose = function() {
        console.log("data channel is closed");
    };
}

export function createOffer(peerRef) {
    peerConnection.createOffer(function(offer) {
        send({
            event : "offer",
            data : offer
        });
        peerConnection.setLocalDescription(offer);
        peerRef.child('offer').set({
            event : "offer",
            sdp : offer.sdp,
        }, (e) => {console.log(`creating offer error: ${e}`)})
    }, function(error) {
        console.log(`creating offer error: ${error}`);
    });
}

export function handleOffer(offer, answerRef) {
    console.log("handling offer: ", offer);
    var offerObj = {
        sdp: offer.sdp,
        type: "offer"
    };
    peerConnection.setRemoteDescription(new RTCSessionDescription(offerObj));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
        answerRef.child('answer').set({
            event : "answer",
            sdp : answer.sdp,
        })
    }, function(error) {
        alert("Error creating an answer");
    });
};

export function handleCandidate(candidate) {
    if (candidate.candidate){
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        changeStatus('idle');
    }
};

export function handleAnswer(answer, peer) {
    var answerObj = {
        sdp: answer.sdp,
        type: "answer"
    };
    peerConnection.setRemoteDescription(new RTCSessionDescription(answerObj));
    console.log("connection established successfully!!");
    changeStatus('idle');
    sendCandidates(peer)

};

export function sendMessage(data) {
    console.log('channel open: ', data, data.type ,dataChannel.readyState);
    if(dataChannel.readyState === 'open'){
        if (data instanceof ArrayBuffer){
            console.log('sending file', data);
            console.log('array buffer', data);
            console.log('ready state', dataChannel.readyState)
            dataChannel.binaryType = "arraybuffer";
            console.log(encode(data))
            dataChannel.send(encode(data));
        }
        else if(data.type === 'file-info'){
            console.log('sending file info', data)
            changeStatus('file-info-sent');
            dataChannel.send(JSON.stringify(data));
        }
        else if(data.type === 'file-acceptance'){
            console.log('accepting file ', data);
            if(data.data){
                changeStatus('receiving');
            } else {
                changeStatus('idle');
            }
            dataChannel.send(JSON.stringify(data));
        }
        else if(data.type === 'file'){
            console.log('sending file', data.data);
            dataChannel.send(data.data);
        } else if (data.type === 'load'){
            console.log("SEND ARRAY BUFFER", data.target);
            dataChannel.send(data.target.result);
        }
        else {
            console.log('lllllllllllllllllllllllllllllll')
        }
    }
}

function sendCandidates(peer) {

    console.log("started sending candidates");
    candidates.map((candid) => {
        console.log("candidate received:", candid)
        databaseRef.child(`/candidates/${peer}`).set({
            event: "candidate",
            data: candid.toJSON(),
        }, (e) => {console.log(`sending candidates error: ${e}`)})
    })

}

var offset = 0;

function sendFile(file) {
    const chunkSize = 16384;
    const fileReader = new FileReader();
    fileReader.addEventListener('error', error => console.error('Error reading file:', error));
    fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
    fileReader.addEventListener('load', e => {
        console.log('FileRead.onload ', e);
        sendMessage(e.target.result)
        offset += e.target.result.byteLength;
        setSent(offset);
        if (offset < file.size) {
            readSlice(offset);
        } else {
            console.log('finished sending file')
            changeStatus('idle');
            offset = 0;
            setSent(offset);
        }
    });
    const readSlice = o => {
        console.log('readSlice ', o);
        if(getStatus() === 'sending'){
            const slice = file.slice(offset, o + chunkSize);
            fileReader.readAsArrayBuffer(slice);
        }
    };
    readSlice(0);
}
