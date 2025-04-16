/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Balboa = require('ES/services/Balboa');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Radios
const RadioService = require('react-pubsub-via-radio.js/service');
const {radio} = require('react-pubsub-via-radio.js');

// Utilities
const {log} = require('../util/DevTools').default;
const {isSolutionTree} = require('../util/Platform').default;

// Actions
const {TranslateActionsFactory} = require('../actions');

const {getText} = TranslateActionsFactory({});

const SharedParams = require('./SharedParams').default;

/******************************************************************************
 *
 * Public Interface
 *
 *****************************************************************************/
const init = () => {
    RadioService(RADIOS.services.RENEW_TOKEN, (data, callback) => {
        // data is all session data and we only need these 3 fields
        let params = _.pick(data, ['username', 'token', 'timestamp'], SharedParams);
        Balboa.api('/authenticate/renewtoken', params, (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Authenticate User'), null);
        });
    }, (data) => {
        // token is a good unique identifier for the call
        return data.token;
    });

    RadioService(RADIOS.services.GET_DISPLAY_LISTS, (data, callback) => {
        Balboa.api('/authenticate/getdisplaylists', SharedParams, (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Retrieve Display Data'), null);
        });
    }, (data) => {
        return RADIOS.services.GET_DISPLAY_LISTS;
    });

    RadioService(RADIOS.services.GET_COMPANY_LISTS, (data, callback) => {
        if (isSolutionTree()) {
            Balboa.api('/authenticate/getsitelists', SharedParams, (successResponse) => {
                if (successResponse.success === true) {
                    callback(null, successResponse.data);
                } else {
                    callback(successResponse.message, null);
                }
            }, (failureResponse) => {
                callback((failureResponse && failureResponse.message) || getText('Failed to Retrieve Companylist Data'), null);
            });
        } else {
            callback(null, {});
        }
    }, (data) => {
        return RADIOS.services.GET_COMPANY_LISTS;
    });

    RadioService(RADIOS.services.FORGOT_PASSWORD, (data, callback) => {
        Balboa.api('/authenticate/forgotpassword', _.assign({}, data, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, true);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Send Email'), null);
        });
    }, (data) => {
        return RADIOS.services.FORGOT_PASSWORD;
    });
};

export default {
    init
}