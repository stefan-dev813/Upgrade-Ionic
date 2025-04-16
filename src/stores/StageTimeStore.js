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
 * Creates an StageTimeStore.  Handles all state changes to the stageTimes
 * area of the state
 *
 * @param {object} spec
 * @property {function} spec.deleteListItem
 * @property {function} spec.updateList
 * @returns {object}
 * @constructor
 */
const StageTimeStoreFactory = (spec) => {
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

    let _deleteStageTime;
    let _saveStageTime;
    let _selectStageTime;

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _deleteStageTime = (payload, event) => {
        return deleteListItem(payload, event, 'Stagetime');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _saveStageTime = (payload, event) => {
        return updateList(payload, event, 'Stagetime');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _selectStageTime = (payload, event) => {
        const selectedStageTime = fromJS(payload);

        return event.set('selectedStageTime', selectedStageTime);
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
            case RADIOS.stores.EVENT_STORE_DELETE_STAGETIME:
                return _deleteStageTime(payload, event);
            case RADIOS.stores.EVENT_STORE_SAVE_STAGETIME:
                return _saveStageTime(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_STAGETIME:
                return _selectStageTime(payload, event);
        }

        return event;
    };
}

export {
    StageTimeStoreFactory
};