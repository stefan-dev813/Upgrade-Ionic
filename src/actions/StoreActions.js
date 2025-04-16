/**
 * Generates the Store Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const StoreActionsFactory = (spec) => {

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

    let _generateAddId;
    let _multiUpdateStart;
    let _multiUpdateStop;

    /**
     * Generates a negative id to keep track of unsaved list items
     * @returns {string}
     */
    _generateAddId = () => {
        return (new Date().getTime() * -1).toString();
    };

    /**
     * Handles the multiUpdateStart action
     *
     * @private
     */
    _multiUpdateStart = () => {
        return {
            type: RADIOS.stores.MULTI_UPDATE_START
        };
    };

    /**
     * Handles the multiUpdateStop action
     *
     * @private
     */
    _multiUpdateStop = () => {
        return {
            type: RADIOS.stores.MULTI_UPDATE_STOP
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        generateAddId: _generateAddId,
        multiUpdateStart: _multiUpdateStart,
        multiUpdateStop: _multiUpdateStop
    };
}

export default StoreActionsFactory;