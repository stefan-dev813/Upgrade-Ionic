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
const CompanyDataModel = require('./models/CompanyDataModel').default;

/**
 * Creates an CompanyDataStore.  Handles all state changes to the companyData
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const CompanyDataStoreFactory = (spec) => {
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
        return new CompanyDataModel({
            companyLists: Map()
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
     * @param {Record|CompanyDataModel} companyData
     * @returns {Record|CompanyDataModel}
     * @private
     */
    _updateStore = (payload, companyData) => {
        let updatedModel = companyData;

        if (_.has(payload, 'timestamp')) {
            updatedModel = updatedModel.set('timestamp', payload.timestamp);
        }

        if (_.has(payload, ['companyLists'])) {
            updatedModel = updatedModel
                .set('companyLists', companyData.get('companyLists').merge(_.get(payload, ['companyLists'])));
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
     * @param {null|Record|CompanyDataModel} companyData
     * @param {object} action
     *
     * @returns {Record|CompanyDataModel}
     */
    return (companyData, action) => {
        if (!companyData) {
            companyData = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.COMPANY_DATA_STORE_UPDATE:
                return _updateStore(payload, companyData);
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return companyData;
    };
}

export {
    CompanyDataStoreFactory
};