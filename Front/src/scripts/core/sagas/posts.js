import { all, call, put, takeLatest, take } from 'redux-saga/effects';

import { request } from '../api/api';
import {ActionTypes } from '../actions/actionTypes';

var sinceTime = (new Date(Date.now())).getTime()
export function* getAllPosts({ payload }) {
  try {
    /* istanbul ignore next */
    console.log('getting all posts')
    const timeout = 10
    let optimalSince= ''
    if(sinceTime){
      optimalSince = "&since_time=" + sinceTime;
    }
    const url = 'http://localhost:8000/longpoll?timeout=' + timeout + '&category=Last post' +optimalSince
    const response = yield call(request, url, {
        payload,
        method: 'GET',
    })
    console.log(response.data)
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
  yield all([takeLatest(ActionTypes.GET_ALL_POSTS_REQUEST, getAllPosts)]);
}