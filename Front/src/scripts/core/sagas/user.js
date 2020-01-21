import { all, call, put, takeLatest, take } from 'redux-saga/effects';

import { request } from '../api/api';
import {ActionTypes } from '../actions/actionTypes';

export function* createUser({ payload }) {
  try {
    /* istanbul ignore next */
    const response = yield call(request, `http://localhost:8000/author/1`, {
        body: {
            Name:"Amirhossein",
            id : 1
        },
        method: 'POST',
    })
  } catch (err) {
      console.log(err)
  }
}

export default function* root() {
  yield all([takeLatest(ActionTypes.CREATE_USER, createUser)]);
}