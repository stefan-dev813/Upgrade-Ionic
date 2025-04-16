/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const {fromJS, List} = require('immutable');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const SearchModel = require('./models/SearchModel').default;

/**
 * Creates an SearchStore.  Handles all state changes to the search
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const SearchStoreFactory = (spec) => {
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
     * @returns {Record|SearchModel}
     * @private
     */
    const _initialState = () => {
        return new SearchModel();
    };

    /**********************************
     * Methods
     *********************************/

    let _autoSearch;
    let _clearResults;
    let _clearStore;
    let _updateStore;

    /**
     *
     * @param {object} payload
     * @returns {Record|SearchModel}
     * @private
     */
    _autoSearch = (payload) => {
        return new SearchModel(payload).set('autoSearch', true);
    };

    /**
     *
     * @param {Record|SearchModel} search
     * @returns {Record|SearchModel}
     * @private
     */
    _clearResults = (search) => {
        return search.set('results', List()).set('noResults', false);
    };

    /**
     *
     * @returns {Record|SearchModel}
     * @private
     */
    _clearStore = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|SearchModel} search
     * @returns {Record|SearchModel}
     * @private
     */
    _updateStore = (payload, search) => {
        let updatedModel = search;

        updatedModel = updatedModel.mergeDeep(fromJS(payload));

        // if (_.has(payload, 'description')) {
        //     updatedModel = updatedModel.set('description', payload.description);
        // }
        //
        // if (_.has(payload, 'results')) {
        //     updatedModel = updatedModel.set('results', fromJS(payload.results));
        // }
        //
        // if (_.has(payload, 'noResults')) {
        //     updatedModel = updatedModel.set('noResults', payload.noResults);
        // }
        //
        // if (_.has(payload, 'searchTerm')) {
        //     updatedModel = updatedModel.set('searchTerm', payload.searchTerm);
        // }

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
     * @param {null|Record|SearchModel} search
     * @param {object} action
     *
     * @returns {Record|SearchModel}
     */
    return (search, action) => {
        if (!search) {
            search = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.SEARCH_STORE_AUTO_SEARCH:
                return _autoSearch(payload, search);
            case RADIOS.stores.SEARCH_STORE_CLEAR:
            case RADIOS.stores.CLEAR_EVENT_ASSOCIATED_DATA:
                return _clearResults(search);
            case RADIOS.stores.SEARCH_STORE_UPDATE:
                return _updateStore(payload, search);
            case RADIOS.stores.LOGOUT:
            case RADIOS.stores.REFRESH_DATA:
                return _clearStore();
        }

        return search;
    };
}

export {
    SearchStoreFactory
};