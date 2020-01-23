import { all, fork } from 'redux-saga/effects';

import posts from './posts'

export default function* rootSaga() {
    yield all([
       fork(posts),
    ])
} 