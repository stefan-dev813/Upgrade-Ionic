/**
 * Generates the Overlay Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const OverlayActionsFactory = (spec) => {

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
    let _updateOverlayStore;
    let _clearOverlay;

    /**
     * Handles the updateOverlayStore action
     *
     * @param data
     * @private
     */
    _updateOverlayStore = (data) => {
        return {
            type: RADIOS.stores.OVERLAY_STORE_UPDATE,
            payload: data
        };
    };

    /**
     * Handles the clearOverlay action
     *
     * @private
     */
    _clearOverlay = () => {
        return {
            type: RADIOS.stores.OVERLAY_STORE_CLEAR
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        updateOverlayStore: _updateOverlayStore,
        clearOverlay: _clearOverlay
    };
}

export default OverlayActionsFactory;