import { all, fork } from 'redux-saga/effects';

import posts from './posts'
import newPost from './newPost'

export default function* rootSaga() {
    yield all([
       fork(posts),
       fork(newPost),
    ])
} 