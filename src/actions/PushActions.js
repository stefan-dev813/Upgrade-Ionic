/**
 * Generates a Push Action
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const PushActionsFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // NPM
    const _ = require('lodash');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Memebers
     *
     *************************************************************************/

    const RADIOS = require('../enums/RADIOS').default;

    /**********************************
     * Methods
     *********************************/

    let _clearNotification;
    let _notify;
    let _parseBody;
    let _register;
    let _updatePushStore;

    /**
     *
     * @private
     */
    _clearNotification = () => {
        return {
            type: RADIOS.stores.PUSH_STORE_UPDATE,
            payload: {
                notification: null
            }
        };
    };

    /**
     *
     * @param data
     * @private
     */
    _notify = (data) => {
        return {
            type: RADIOS.stores.PUSH_STORE_NOTIFY,
            payload: data
        };
    };

    /**
     * Takes in the Body of the notification and parses the information
     *
     * @param {string} additionalData
     * @returns {object}
     * @private
     */
    _parseBody = (additionalData) => {
        if (!additionalData)
            return null;

        /**
         * New structure layout:
         *
         * data.additionalData.default.data.{
         *  body,
         *  title,
         *  eventId,
         *  category
         * }
         *
         */

        if(additionalData.hasOwnProperty('default') && additionalData.default.hasOwnProperty('data')) {
            return additionalData.default.data;
        }

        return null;
    };

    /**
     *
     * @param date
     * @private
     */
    _register = (data) => {
        return {
            type: RADIOS.stores.PUSH_STORE_REGISTER,
            payload: data
        };
    };

    /**
     *
     * @param data
     * @private
     */
    _updatePushStore = (data) => {
        return {
            type: RADIOS.stores.PUSH_STORE_UPDATE,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        clearNotification: _clearNotification,
        notify: _notify,
        parseBody: _parseBody,
        register: _register,
        updatePushStore: _updatePushStore
    };
}

export default PushActionsFactory;