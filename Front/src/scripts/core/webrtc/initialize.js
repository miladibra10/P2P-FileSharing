/* jshint -W030 */
import { Promise } from 'rsvp';
import config from '../../environment';

import {request} from '../api/api'
// import Analytics from '../services/analytics';

export function initialize() {
    function checkWebRTCSupport() {
        return new Promise((resolve, reject) => {
            resolve()
        });
    }

    function clearFileSystem() {
        return new Promise((resolve, reject) => {
            // TODO: change File into a service and require it here
            resolve()
        });
    }

    function authenticateToFirebase() {
        return new Promise((resolve, reject) => {
            const xhr = request('http://rester.ir/ip', {
                method: 'GET',
            });
            xhr.then((data) => {
                sessionStorage.setItem('ip', data.data.ip)
                // roomsRef.set({
                //
                // }   )
                // roomsRef.once('value').then(function(snapshot) {
                //     var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                //     // ...
                // })
            });
            resolve();
        });
    }

    // TODO: move it to a separate initializer
    function trackSizeOfReceivedFiles() {
        // $.subscribe('file_received.p2p', (event, data) => {
        //     Analytics.trackEvent(
        //         'file',
        //         'received',
        //         'size',
        //         Math.round(data.info.size / 1000)
        //     );
        // });
    }

    // application.deferReadiness();
    console.log('initialized')
    checkWebRTCSupport()
        .then(clearFileSystem)
        .catch((error) => {
            // eslint-disable-next-line no-param-reassign
            console.log(error);
        })
        .then(authenticateToFirebase)
        .then(trackSizeOfReceivedFiles)
        .then(() => {
            // application.advanceReadiness();
            console.log('all is well')
        });
}

export default {
    name: 'prerequisites',
    initialize,
};
