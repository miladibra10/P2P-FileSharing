import { all, call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../api/api';
import {ActionTypes } from '../actions/actionTypes';

export function* search({ payload }) {
    try {
        /* istanbul ignore next */
        console.log('searching', payload);

        const url = 'http://localhost:8000'
        const response = yield call(request, url, {
            payload,
            method: 'GET',
        });
        if(response.data && response.data.events && response.data.events.length > 0){
            console.log('success');

            for (var i = 0; i < response.data.events.length; i++) {
                // Display event
                var event = response.data.events[i];
                sinceTime = event.timestamp;
            }

            yield put({
                type: ActionTypes.GET_ALL_POSTS_REQUEST,
            })
        }
        if (response.data && response.data.timeout) {
            console.log("No events, checking again.");
            yield put({
                type: ActionTypes.GET_ALL_POSTS_REQUEST,
            })
        }
        if (response.data && response.data.error) {
            console.log("Error response: " + response.data.error);
            console.log("Trying again shortly...")
            yield put({
                type: ActionTypes.GET_ALL_POSTS_REQUEST,
            })
        }

    } catch (err) {
        yield put({
            type: ActionTypes.GET_ALL_POSTS_FAILURE,
            payload: {
                message: err,
            },
        });
    }
}

export default function* root() {
    yield all([takeLatest(ActionTypes.SEARCH_USER_REQUEST, search)]);
}