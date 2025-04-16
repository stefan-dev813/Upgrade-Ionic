/* global navigator */

/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// For some reason React doesn't pick this up even though it is perfectly set
// You have to manually set it again first thing.  Amazing.

// Node Modules
const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('lodash');
const {createResponsiveStoreEnhancer} = require('redux-responsive');
import { Iterable } from 'immutable';

const Platform = require('./util/Platform').default;

// if (!Platform.isProduction()) {
//     /* global global */
//     // Perf
//     global.Perf = require('react-addons-perf');
// }

// Redux
const {Provider} = require('react-redux');
const {applyMiddleware, compose, createStore} = require('redux');

const AppStore = require('./stores/AppStore').default;

const ArrayDispatchMiddleware = require('./mixins/ArrayDispatchMiddleware').default;
const {createLogger} = require("redux-logger");

// Factories
const MainViewFactory = require('./views/MainView').default;

// Utilities
const {log} = require('./util/DevTools').default;

import "./app.less";

/**************************************
 * Components
 *************************************/
let store;
const hasDevTools = _.isFunction(window.__REDUX_DEVTOOLS_EXTENSION__);
const responsiveStoreEnhancer = createResponsiveStoreEnhancer({performanceMode: false});
const middlewares = [ArrayDispatchMiddleware];
if (!hasDevTools || Platform.isProduction()) {
    store = createStore(AppStore,
        compose(
            responsiveStoreEnhancer,
            applyMiddleware(...middlewares)
        )
    );
} else {
    // add logger for development mode
    const logger = createLogger({
        level: "error",
        collapsed: (getState, action, logEntry) => !logEntry.error,
        duration: true,
        colors: {
            title: false,
            prevState: false,
            action: false,
            nextState: false,
            error: false
        },
        stateTransformer: (state) => {
            let newState = {};

            for (var i of Object.keys(state)) {
                if (Iterable.isIterable(state[i])) {
                    newState[i] = JSON.stringify(state[i].toJS());
                } else {
                    newState[i] = JSON.stringify(state[i]);
                }
            };

            return newState;
        }
    });
    middlewares.push(logger);

    store = createStore(AppStore,
        compose(
            responsiveStoreEnhancer,
            applyMiddleware(...middlewares),
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    );
}

const MainView = MainViewFactory({});

// If we are testing on local webserver/Chrome, then render the app right away.
// if (hasDevTools || (!Platform.isProduction() && !Platform.isPhoneGap())) {
//     document.renderApp();
// } else {
//     document.renderApp();
// }
ReactDOM.render(<Provider store={store}><MainView /></Provider>, document.getElementById('espeakers-mobile'));

// If we are testing on local webserver/Chrome, then render the app right away.
// ReactDOM.render(<Provider store={store}><MainView/></Provider>, document.getElementById('espeakers-mobile'));