import {databaseRef} from "./firebase";


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
        optional : [ {
            RtpDataChannels : true
        } ]
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
        console.log("message:", event.data);
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
    }
};

export function handleAnswer(answer, peer) {
    var answerObj = {
        sdp: answer.sdp,
        type: "answer"
    };
    peerConnection.setRemoteDescription(new RTCSessionDescription(answerObj));
    console.log("connection established successfully!!");
    sendCandidates(peer)

};

export function sendMessage(data) {
    console.log(data, dataChannel.readyState)
    if(dataChannel.readyState === 'open'){
        dataChannel.send(data);
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