import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/index';
const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // options like actionSanitizer, stateSanitizer
            trace: true
        }) : compose;
const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);

const store = createStore(reducer, enhancer);

export default store;