/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const {Map} = require('immutable');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const DisplayDataModel = require('./models/DisplayDataModel').default;

/**
 * Creates an DisplayDataStore.  Handles all state changes to the displayData
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DisplayDataStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    /**
     *
     * @returns {Record|DisplayDataModel}
     * @private
     */
    const _initialState = () => {
        return new DisplayDataModel({
            displayLists: Map()
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _updateStore;

    /**
     *
     * @returns {Record|DisplayDataModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|DisplayDataModel} displayData
     * @returns {Record|DisplayDataModel}
     * @private
     */
    _updateStore = (payload, displayData) => {
        let updatedModel = displayData;
        let bureauMap = Map();

        if (_.has(payload, 'timestamp')) {
            updatedModel = updatedModel.set('timestamp', payload.timestamp);
        }

        if (_.has(payload, 'displayLists')) {
            // flatten/optimize the big list of bureaus
            if (payload['displayLists'] && payload['displayLists']['universal'] && payload['displayLists']['universal']['bureaus']) {
                _.map(payload['displayLists']['universal']['bureaus'], (item) => {
                    bureauMap = bureauMap.set(item['bid'], item['bname']);
                });
            }

            updatedModel = updatedModel
                .set('bureauMap', bureauMap)
                .set('displayLists', displayData.get('displayLists').merge(payload.displayLists));
        }

        return updatedModel;
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    /**
     * Handler for all actions this Reducer cares about
     *
     * @param {null|Record|DisplayDataModel} displayData
     * @param {object} action
     *
     * @returns {Record|DisplayDataModel}
     */
    return (displayData, action) => {
        if (!displayData) {
            displayData = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.DISPLAY_DATA_STORE_UPDATE:
                return _updateStore(payload, displayData);
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return displayData;
    };
}

export {
    DisplayDataStoreFactory
};