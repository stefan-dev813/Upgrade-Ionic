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
const PushModel = require('./models/PushModel').default;

// Services
const {fetchItem, storeItem, removeItem} = require('../services/LocalStorageService').default();

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an PushStore.  Handles all state changes to the push area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const PushStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const _initialState = () => {
        return new PushModel({
            registrationId: fetchItem(STORAGE.PUSH_REG_ID)
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _notify;
    let _register;
    let _updateStore;

    /**
     *
     * @param {object} payload
     * @param {PushModel} push
     * @returns {PushModel}
     * @private
     */
    _notify = (payload, push) => {
        return push.set('notification', fromJS(payload));
    };

    /**
     *
     * @param {object} payload
     * @param {PushModel} push
     * @returns {PushModel}
     * @private
     */
    _register = (payload, push) => {
        storeItem(STORAGE.PUSH_REG_ID, payload);
        return push.set('registrationId', payload);
    };

    /**
     *
     * @param {object} payload
     * @param {PushModel} push
     * @returns {PushModel}
     * @private
     */
    _updateStore = (payload, push) => {
        let updatedModel = push;

        if (_.has(payload, 'registrationId')) {
            updatedModel = updatedModel.set('registrationId', payload.registrationId);
            storeItem(STORAGE.PUSH_REG_ID, payload.registrationId);
        }

        if (_.has(payload, 'notification')) {
            updatedModel = updatedModel.set('notification', fromJS(payload.notification));
        }

        return updatedModel;
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
     * @param {null|Record|PushModel} push
     * @param {object} action
     *
     * @returns {Record|PushModel}
     */
    return (push, action) => {
        if (!push) {
            push = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.PUSH_STORE_NOTIFY:
                return _notify(payload, push);
            case RADIOS.stores.PUSH_STORE_REGISTER:
                return _register(payload, push);
            case RADIOS.stores.PUSH_STORE_UPDATE:
                return _updateStore(payload, push);
        }

        return push;
    };
}

export {
    PushStoreFactory
};