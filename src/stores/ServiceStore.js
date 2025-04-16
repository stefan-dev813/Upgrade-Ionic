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

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an ServiceStore.  Handles all state changes to the services
 * area of the state
 *
 * @param {object} spec
 * @property {function} spec.deleteListItem
 * @property {function} spec.updateList
 * @returns {object}
 * @constructor
 */
const ServiceStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {deleteListItem, updateList} = spec;

    /**********************************
     * Variables
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _deleteService;
    let _saveService;
    let _selectService;

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _deleteService = (payload, event) => {
        return deleteListItem(payload, event, 'Service');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _saveService = (payload, event) => {
        return updateList(payload, event, 'Service');
    };

    /**
     *
     * @param payload
     * @param event
     * @private
     */
    _selectService = (payload, event) => {
        const selectedService = fromJS(payload);

        return event.set('selectedService', selectedService);
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
     * @param {Record|EventModel} event
     * @param {object} action
     *
     * @returns {Record|EventModel}
     */
    return (event, action) => {
        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.EVENT_STORE_DELETE_SERVICE:
                return _deleteService(payload, event);
            case RADIOS.stores.EVENT_STORE_SAVE_SERVICE:
                return _saveService(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_SERVICE:
                return _selectService(payload, event);
        }

        return event;
    };
}

export {
    ServiceStoreFactory
};