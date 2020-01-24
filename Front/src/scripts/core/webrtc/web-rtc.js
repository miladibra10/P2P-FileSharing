

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
        iceCandidatePoolSize: 10,
    };

    peerConnection = new RTCPeerConnection(configuration, {
        optional : [ {
            RtpDataChannels : true
        } ]
    });
    console.log('initialize called')
    // Setup ice handling

    peerConnection.onicecandidate = function(event) {
        console.log('on ice candidate called')
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
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
        peerRef.child('offer1').set({
            event : "offer",
            sdp : offer.sdp,
        }, (e) => {console.log(e)})
    }, function(error) {
        console.log(error);
    });
}

export function handleOffer(offer, peerRef) {
    console.log("handling offer", offer)
    console.log("peer ref offer", peerRef)
    var offerObj = {
        sdp: offer.sdp,
        type: "offer"
    }
    peerConnection.setRemoteDescription(new RTCSessionDescription(offerObj));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
        peerRef.child('answer').set({
            event : "answer",
            sdp : offer.sdp,
        })
    }, function(error) {
        alert("Error creating an answer");
    });

};

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
};

function sendMessage() {
    dataChannel.send(input.value);
    input.value = "";
}