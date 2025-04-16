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
 * Creates an ProductStore.  Handles all state changes to the products
 * area of the state
 *
 * @param {object} spec
 * @property {function} spec.deleteListItem
 * @property {function} spec.updateList
 * @returns {object}
 * @constructor
 */
const ProductStoreFactory = (spec) => {
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

    let _deleteProduct;
    let _saveProduct;
    let _selectProduct;

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _deleteProduct = (payload, event) => {
        return deleteListItem(payload, event, 'ProductSale');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _saveProduct = (payload, event) => {
        return updateList(payload, event, 'ProductSale');
    };

    /**
     *
     * @param payload
     * @param event
     * @private
     */
    _selectProduct = (payload, event) => {
        const selectedProduct = fromJS(payload);

        return event.set('selectedProduct', selectedProduct);
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
            case RADIOS.stores.EVENT_STORE_DELETE_PRODUCT:
                return _deleteProduct(payload, event);
            case RADIOS.stores.EVENT_STORE_SAVE_PRODUCT:
                return _saveProduct(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_PRODUCT:
                return _selectProduct(payload, event);
        }

        return event;
    };
}

export {
    ProductStoreFactory
};