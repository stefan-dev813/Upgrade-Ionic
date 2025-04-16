/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

/* global device */

// Node Modules
const _ = require('lodash');

// Utilities
const Ajax = require('ES/services/Ajax');
const crypto = require('crypto');
const {log} = require('../util/DevTools').default;
const {hasPush, getBalboaUrl} = require('../util/Platform').default;

// Actions
const {TranslateActionsFactory} = require('../actions');

/**
 * Interacts with the Authenticate service, but outside of Balboa
 * @params {object} spec - Collection of all parameters
 *
 * @return {object}
 */
const LoginServiceFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    const GET = 'GET';
    const POST = 'POST';

    // set some default request options
    const baseOptions = {
        method: GET,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    /**********************************
     * Methods
     *********************************/

    // Declare our methods so there is no reference errors
    let _sha512;
    let _buildOptions;
    let _generateHash;

    /**
     * Creates a SHA hash of the provided text
     *
     * @private
     * @param {string} text - String that you want hashed
     *
     * @return {string}
     */
    _sha512 = (text) => {
        let shasum = crypto.createHash('sha512');
        shasum.update(text);
        return shasum.digest('hex');
    };

    /**
     * Merges all the various options needing to be attached to the request.
     *
     * @private
     * @param {string} method - HTTP Method
     * @param {object} body - JSON object you want sent in the body of the request
     *
     * @return {object}
     */
    _buildOptions = (method, body) => {
        return _.assign({}, baseOptions, {method: method}, (method === POST ? {body: JSON.stringify(body)} : null));
    };

    /**
     * Creates a secure hash based on the provided login credentials
     *
     * @private
     * @param {string} username
     * @param {string} password
     *
     * @return {string}
     */
    _generateHash = (username, password) => {
        return _sha512([username, password].join('.').toLowerCase());
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        /**
         * Calls the service to authenticate the user
         *
         * @param {object} - Collection of all named parameters
         * @property {object} spec - Collection of all named parameters
         * @property {string} spec.username
         * @property {string} spec.password
         * @property {function} spec.success - Callback for a success response
         * @property {function} spec.failure - Callback for a failure response
         * @property {string} spec.registrationId - Push Registration
         */
        login(spec) {
            const {username, password, success, failure, registrationId} = spec;

            let deviceType;
            let platform;

            let body = {
                username: username,
                plaintext_password: password,
                client: 'mobile'
            };

            if(hasPush() && registrationId) {
                platform = device && device.platform && device.platform.toLowerCase();

                if(platform === 'android') {
                    deviceType = 'GCM';
                } else if(platform === 'ios') {
                    deviceType = 'APNS';
                }

                if(deviceType) {
                    body = _.assign(body, {
                        pushdevicetype: deviceType,
                        pushdevicetoken: registrationId
                    });
                }
            }

            let xhr = Ajax.post(`${getBalboaUrl()}/authenticate/gettoken`, body, (error, responseText, status, xhr) => {
                try {
                    // TODO: handle pushregistered = false
                    if(!error && responseText) {
                        let responseData = JSON.parse(responseText);
                        if (responseData && responseData.success === true) {
                            return success(responseData);
                        } else {
                            return failure(responseData);
                        }
                    } else {
                        failure(error);
                    }
                } catch(e) {
                    return failure((e && e.message) || getText('Failed to authenticate user.'));
                }
            });
        }
    };
}

export default LoginServiceFactory;