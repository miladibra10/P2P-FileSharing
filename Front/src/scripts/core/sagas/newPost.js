import { all, call, put, takeLatest, take } from 'redux-saga/effects';

import { request } from '../api/api';
import {ActionTypes } from '../actions/actionTypes';

export function* createPost({ payload }) {
  try {
    /* istanbul ignore next */
    console.log('creating new post', payload)
    const response = yield call(request, `http://localhost:8000/post/${payload.userID}`, {
        body: payload.post,
        method: 'POST',
    })
    yield put({
      type: ActionTypes.CREAT_NEW_POST_SUCCEST,
      payload: {
        posts: response,
      },
    });
  } catch (err) {
      yield put({
        type: ActionTypes.CREATE_NEW_POST_FAILURE,
        payload: {
          message: err,
        },
      });
  }
}

export default function* root() {
  yield all([takeLatest(ActionTypes.CREATE_NEW_POST_REQUEST, createPost)]);
}