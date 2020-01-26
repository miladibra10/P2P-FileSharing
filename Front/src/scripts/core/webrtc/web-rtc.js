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
var receivedStr = "";
var receivedSize = 0;
var receivedFile = null;
var chunkSize = 50;
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
    // dataChannel.binaryType = "arraybuffer";

    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("received message: ", event, event.type, event.data);
        const jsonData = JSON.parse(event.data)
        console.log("json data: ", jsonData)
        if (jsonData.type === 'file-info'){
            console.log("received file-info: ", jsonData)
            changeStatus('file-info-received');
            changeFileInfo(jsonData)
        } else if (jsonData.type === 'file-acceptance'){
            console.log("received acceptance: ", jsonData);
            if(jsonData.data === true){
                console.log('sending new file', getFile());
                changeStatus('sending');
                sendFile(getFile())
            } else {
                changeStatus('idle');
            }
        } else if (jsonData.type === "chunk") {
            console.log("no match. it seems file", event, event.data, event.data.constructor)
            // receivedBuffer.push(event.data);
            receivedStr += jsonData.data;
            receivedSize += chunkSize;
            setReceived(receivedSize);

            if (receivedSize >= getFileInfo().size) {
                // receivedFile = new Blob(receivedBuffer);
                receivedFile = new Blob([receivedStr], {type: getFileInfo().type});

                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";


                var url = window.URL.createObjectURL(receivedFile);
                a.href = url;
                a.download = getFileInfo().name;
                a.click();
                window.URL.revokeObjectURL(url);

                receivedStr = "";
                setLink(URL.createObjectURL(receivedFile))
                changeStatus('idle');
                setReceived(0);
                receivedSize=0;
                console.log('finished receiving file', URL.createObjectURL(receivedFile))
            }
        }
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
        if (data.type === 'file-info'){
            console.log('sending file info', data)
            changeStatus('file-info-sent');
            dataChannel.send(JSON.stringify(data));
        } else if (data.type === 'file-acceptance'){
            console.log('accepting file ', data);
            if(data.data){
                changeStatus('receiving');
            } else {
                changeStatus('idle');
            }
            dataChannel.send(JSON.stringify(data));
        } else if (data.type === "chunk"){
            console.log("with channel")
            dataChannel.send(JSON.stringify(data))
        }
        else {
            console.log('no type found', data);
            console.log('send data', data);
            // console.log(encode(data));
            dataChannel.send(data);
        }
        // if (data instanceof ArrayBuffer){
        //     console.log('sending file', data);
        //     console.log('array buffer', data);
        //     console.log('ready state', dataChannel.readyState)
        //     dataChannel.binaryType = "arraybuffer";
        //     console.log(encode(data))
        //     dataChannel.send(encode(data));
        // }
        // else if(data.type === 'file-info'){
        //     console.log('sending file info', data)
        //     changeStatus('file-info-sent');
        //     dataChannel.send(JSON.stringify(data));
        // }
        // else if(data.type === 'file-acceptance'){
        //     console.log('accepting file ', data);
        //     if(data.data){
        //         changeStatus('receiving');
        //     } else {
        //         changeStatus('idle');
        //     }
        //     dataChannel.send(JSON.stringify(data));
        // }
        // else if(data.type === 'file'){
        //     console.log('sending file', data.data);
        //     dataChannel.send(data.data);
        // } else if (data.type === 'load'){
        //     console.log("SEND ARRAY BUFFER", data.target);
        //     dataChannel.send(data.target.result);
        // }
        // else {
        //     console.log('lllllllllllllllllllllllllllllll')
        // }
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
    // var chunkSize = 16384;
    const fileReader = new FileReader();
    fileReader.addEventListener('error', error => console.error('Error reading file:', error));
    fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
    fileReader.addEventListener('load', e => {
        console.log('FileRead.onload ', e, e.constructor, e.type);
        var fileChunkData = {
            type: "chunk",
            data: e.target.result + ""
        };
        setTimeout(() => {
            sendMessage(fileChunkData)
            // offset += e.target.result.byteLength;
            offset += chunkSize;
            console.log("offset", offset)
            setSent(offset);
            if (offset < file.size) {
                readSlice(offset);
            } else {
                console.log('finished sending file')
                changeStatus('idle');
                offset = 0;
                setSent(offset);
            }
        }, 100)
    });
    const readSlice = o => {
        console.log('readSlice ', o);
        if(getStatus() === 'sending'){
            console.log('slice read', offset)
            const slice = file.slice(offset, o + chunkSize);
            // fileReader.readAsArrayBuffer(slice);
            fileReader.readAsBinaryString(slice);
        }
    };
    readSlice(0);
}
