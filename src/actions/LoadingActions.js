/**
 * Generates the Loading Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const LoadingActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

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
    let _showLoading;
    let _hideLoading;
    let _updateLoadingStore;

    /**
     * Handles the showLoading action
     *
     * @private
     */
    _showLoading = () => {
        console.log("Showing spinner");
        return {
            type: RADIOS.stores.LOADING_STORE_SHOW
        };
    };

    /**
     * Handles the hideLoading action
     *
     * @private
     */
    _hideLoading = () => {
        console.log("Hiding spinner");
        return {
            type: RADIOS.stores.LOADING_STORE_HIDE
        };
    };

    /**
     * Handles the updateLoadingStore action
     *
     * @param payload
     * @private
     */
    _updateLoadingStore = (payload) => {
        console.log("Update spinner");
        return {
            type: RADIOS.stores.LOADING_STORE_UPDATE,
            payload
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        showLoading: _showLoading,
        hideLoading: _hideLoading,
        updateLoadingStore: _updateLoadingStore
    };
}


export default LoadingActionsFactory;