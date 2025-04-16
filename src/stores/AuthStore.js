/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Immutable = require('immutable');
const {fromJS} = Immutable;

// Enums
const RADIOS = require('../enums/RADIOS').default;
const STORAGE = require('../enums/STORAGE').default;

// Models
const AuthModel = require('./models/AuthModel').default;
const MessageModel = require('./models/MessageModel').default;
const PushModel = require('./models/PushModel').default;

// Services
const {fetchItem, storeItem, removeItem, clear} = require('../services/LocalStorageService').default();

// Factories
const AuthedUserSessionFactory = require('../util/AuthedUserSession').default;

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an AuthStore.  Handles all state changes to the auth area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const AuthStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**
     * Loads session/authentication object form local storage.
     *
     * @returns {object}
     * @private
     */
    let _loadSessionFromStorage = () => {
        try {
            return fetchItem(STORAGE.SESSION_DATA, JSON.parse);
        } catch (e) {
            return null;
        }
    };

    /**********************************
     * Variables
     *********************************/

    const _initialState = () => {
        return new AuthModel({
            sessionData: fromJS(_loadSessionFromStorage() || {}),
            authedUserSession: fromJS(AuthedUserSessionFactory({sessionData: _loadSessionFromStorage() || {}}))
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _logout;
    let _updateStore;

    /**
     * Clears the session data
     *
     * @param {AuthModel} auth
     * @returns {AuthModel}
     * @private
     */
    _logout = (auth) => {
        let sessionData = fromJS({});
        removeItem(STORAGE.SESSION_DATA);
        return auth.set('sessionData', sessionData).set('authedUserSession', fromJS(AuthedUserSessionFactory({sessionData: sessionData.toJS()})));
    };

    /**
     *
     * @param {object} payload
     * @param {AuthModel} auth
     * @returns {AuthModel}
     * @private
     */
    _updateStore = (payload, auth) => {
        let updatedAuth = auth;

        if (_.has(payload, 'sessionData')) {
            updatedAuth = updatedAuth
                .set('sessionData', fromJS(payload.sessionData))
                .set('authedUserSession', fromJS(AuthedUserSessionFactory({sessionData: payload.sessionData})));

            storeItem(STORAGE.SESSION_DATA, payload.sessionData);
        }
        return updatedAuth;
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    /**
     * Handles all store based radio calls and determines an action to take
     * if any.
     *
     * @param {null|Record|AuthModel} auth
     * @param {object} action
     * @returns {Record|AuthModel}
     */
    return (auth, action) => {
        if (!auth) {
            auth = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.AUTH_STORE_UPDATE:
                return _updateStore(payload, auth);
            case RADIOS.stores.LOGOUT:
                return _logout(auth);
        }

        return auth;
    };
}

export {
    AuthStoreFactory
};