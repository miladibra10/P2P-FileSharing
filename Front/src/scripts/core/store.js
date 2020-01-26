import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers/rootReducer";
import logger from "redux-logger";
import rootSaga from './sagas/index'

const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware), applyMiddleware(logger))
);

export default () => {
  sagaMiddleware.run(rootSaga);

  return store;
};
