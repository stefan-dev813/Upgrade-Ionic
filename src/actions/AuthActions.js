/**
 * Generates a Auth Action
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const AuthActionsFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Radios
    const {
        radio
    } = require('react-pubsub-via-radio.js');

    /**************************************************************************
     *
     * Private Memebers
     *
     *************************************************************************/


    /**********************************
     * Methods
     *********************************/
    let _forgotPassword;
    let _renewToken;
    let _updateAuthStore;
    let _logout;

    /**
     * Handles the forgotPassword action
     *
     * @param data
     * @private
     */
    _forgotPassword = (data) => {
        radio(RADIOS.services.FORGOT_PASSWORD).broadcast(data);
    };

    /**
     * Handles the renewToken action
     *
     * @param date
     * @private
     */
    _renewToken = (data) => {
        radio(RADIOS.services.RENEW_TOKEN).broadcast({
            username: data.get('username'),
            token: data.get('token'),
            timestamp: data.get('timestamp')
        });
    };

    /**
     * Handles the updateAuthStore action
     *
     * @param data
     * @private
     */
    _updateAuthStore = (data) => {
        return {
            type: RADIOS.stores.AUTH_STORE_UPDATE,
            payload: data
        };
    };

    /**
     * Handles the logout action
     *
     * @private
     */
    _logout = () => {
        return {
            type: RADIOS.stores.LOGOUT
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        forgotPassword: _forgotPassword,
        renewToken: _renewToken,
        updateAuthStore: _updateAuthStore,
        logout: _logout
    };
}

export default AuthActionsFactory;