import { createStore, applyMiddleware, compose } from 'redux';
import {createLogger} from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();
const middleware = [];

// For redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default (preloadedState) => createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middleware, loggerMiddleware)));
