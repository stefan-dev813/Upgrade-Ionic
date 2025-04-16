/**
 * Generates the Search Actions
 *
 * @param spec
 * @returns {{clearSearch: *, updateSearchStore: *, searchEvents: *}}
 * @constructor
 */
const SearchActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Node Modules
    const _ = require('lodash');

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _autoSearch;
    let _clearSearch;
    let _updateSearchStore;
    let _searchEvents;

    /**
     *
     * @param searchTerm
     * @returns {{type: *, payload: *}}
     * @private
     */
    _autoSearch = (data) => {
        let payload = data;

        if(_.isString(data)) {
            payload = {
                searchTerm: data
            };
        }

        return {
            type: RADIOS.stores.SEARCH_STORE_AUTO_SEARCH,
            payload
        };
    };

    /**
     * Handles the clearSearch action
     *
     * @private
     */
    _clearSearch = () => {
        return {
            type: RADIOS.stores.SEARCH_STORE_CLEAR
        };
    };

    /**
     * Handles the updateSearchStore action
     *
     * @param data
     * @private
     */
    _updateSearchStore = (data) => {
        return {
            type: RADIOS.stores.SEARCH_STORE_UPDATE,
            payload: data
        };
    };

    /**
     * Handles the searchEvents action
     *
     * @param data
     * @private
     */
    _searchEvents = (data) => {
        radio(RADIOS.services.SEARCH_EVENTS).broadcast(data);
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        autoSearch: _autoSearch,
        clearSearch: _clearSearch,
        updateSearchStore: _updateSearchStore,
        searchEvents: _searchEvents
    };
}

export default SearchActionsFactory;