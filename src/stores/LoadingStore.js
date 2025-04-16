/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const LoadingModel = require('./models/LoadingModel').default;

// Utilities
const {log} = require('../util/DevTools').default;

/**
 * Creates an LoadingStore.  Handles all state changes to the loading area
 * of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const LoadingStoreFactory = (spec) => {
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
     * @returns {Record|LoadingModel}
     * @private
     */
    const _initialState = () => {
        return new LoadingModel({});
    };

    /**********************************
     * Methods
     *********************************/

    /**
     *
     * @param {object} payload
     * @param {Record|LoadingModel} loading
     * @returns {Record|LoadingModel}
     * @private
     */
    const _updateStore = (payload, loading) => {
        let updatedModel = loading;

        if (_.has(payload, 'show')) {
            updatedModel = updatedModel.set('show', payload.show);
        }

        if (_.has(payload, 'silentRefresh')) {
            updatedModel = updatedModel.set('silentRefresh', payload.silentRefresh);
        }

        return updatedModel;
    };

    /**
     *
     * @param {Record|LoadingModel} loading
     * @returns {Record|LoadingModel}
     * @private
     */
    const _showLoading = (loading) => {
        let show = true;

        if (loading.get('silentRefresh')) {
            show = false;
        }

        return loading.set('counter', (loading.get('counter') + 1)).set('show', true);
    };

    /**
     *
     * @param {Record|LoadingModel} loading
     * @returns {Record|LoadingModel}
     * @private
     */
    const _hideLoading = (loading) => {
        return loading.set('counter', (loading.get('counter') - 1)).set('show', false).set('silentRefresh', false);
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
     * @param {null|Record|LoadingModel} loading
     * @param {object} action
     *
     * @returns {Record|LoadingModel}
     */
    return (loading, action) => {
        if (!loading) {
            loading = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.LOADING_STORE_UPDATE:
                return _updateStore(payload, loading);
            case RADIOS.stores.LOADING_STORE_HIDE:
                return _hideLoading(loading);
            case RADIOS.stores.LOADING_STORE_SHOW:
                return _showLoading(loading);
        }

        return loading;
    };
}

export {
    LoadingStoreFactory
};