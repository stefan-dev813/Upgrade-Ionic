/**
 * Generates a DisplayData action
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DisplayDataActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    // Actions
    const LoadingActionsFactory = require('./LoadingActions').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {updateLoadingStore} = LoadingActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _updateDisplayDataStore;
    let _getDisplayLists;
    let _getSiteLists;
    let _refreshDisplayData;
    let _verifyDisplayLists;

    /**
     *  Handles the updateDisplayDataStore action
     *
     * @param data
     * @private
     */
    _updateDisplayDataStore = (data) => {
        return {
            type: RADIOS.stores.DISPLAY_DATA_STORE_UPDATE,
            payload: data
        };
    };

    /**
     *  Handles the getDisplayList action
     *
     * @private
     */
    _getDisplayLists = () => {
        radio(RADIOS.services.GET_DISPLAY_LISTS).broadcast();
    };

    /**
     * Handles the refreshDisplayData action
     *
     * @private
     */
    _refreshDisplayData = (silent) => {
        // Get display lists
        _getDisplayLists();

        // Also need to clear out any current data sets: calendar, search, etc.
        return [
            updateLoadingStore({
                silentRefresh: silent || false
            }),
            {
                type: RADIOS.stores.REFRESH_DATA
            }
        ];
    };

    /**
     * Handles the verifyDisplayLists action
     *
     * @private
     */
    _verifyDisplayLists = () => {
        radio(RADIOS.stores.VERIFY_DISPLAY_LISTS).broadcast();
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        updateDisplayDataStore: _updateDisplayDataStore,
        refreshDisplayData: _refreshDisplayData,
        getDisplayLists: _getDisplayLists,
        verifyDisplayLists: _verifyDisplayLists
    };
}

export default DisplayDataActionsFactory;

