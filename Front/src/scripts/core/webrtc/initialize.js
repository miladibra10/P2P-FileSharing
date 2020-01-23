/* jshint -W030 */
import { Promise } from 'rsvp';
import config from '../../environment';
import {roomsRef} from "./firebase";

import FileSystem from './file';
import {util} from './peer';
import {request} from '../api/api'
// import Analytics from '../services/analytics';

export function initialize() {
    function checkWebRTCSupport() {
        return new Promise((resolve, reject) => {
            if (util.supports.sctp) {
                resolve();
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('browser-unsupported');
            }
        });
    }

    function clearFileSystem() {
        return new Promise((resolve, reject) => {
            // TODO: change File into a service and require it here
            FileSystem.removeAll()
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    console.log(e)
                    reject('filesystem-unavailable');
                });
        });
    }

    function authenticateToFirebase() {
        return new Promise((resolve, reject) => {
            const xhr = request('http://rester.ir/ip', {
                method: 'GET',
            });
            xhr.then((data) => {
                console.log(data, roomsRef);
                roomsRef.set({
                    username: 'name',
                    email: 'email',
                    profile_picture : 'imageUrl'
                })
                roomsRef.once('value').then(function(snapshot) {
                    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                    console.log((username))
                    // ...
                })
                // const ref = new window.Firebase(config.FIREBASE_URL);
                // // eslint-disable-next-line no-param-reassign
                // application.ref = ref;
                // // eslint-disable-next-line no-param-reassign
                // application.userId = data.id;
                // // eslint-disable-next-line no-param-reassign
                // application.publicIp = data.public_ip;
                //
                // ref.authWithCustomToken(data.token, (error) => {
                //     if (error) {
                //         reject(error);
                //     } else {
                //         resolve();
                //     }
                // });
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
