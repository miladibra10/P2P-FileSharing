import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyBW0bCIQu2sOQMWkqCMkM6WsnJTA9NMrz4",
    authDomain: "http://filesharing-6fd12.firebaseapp.com/",
    databaseURL: "https://filesharing-6fd12.firebaseio.com/",
    projectId: "filesharing-6fd12",
    // storageBucket: "ENTER YOURS HERE",
    // messagingSenderId: "ENTER YOURS HERE"
}
firebase.initializeApp(config);

const databaseRef = firebase.database().ref();
export const roomsRef = databaseRef.child("rooms")