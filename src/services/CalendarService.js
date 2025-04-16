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
    RadioService(RADIOS.services.LOAD_DASHBOARD, (data, callback) => {
        // data is all session data and we only need these 3 fields
        let params = {
            company_id: _.get(data, ['company_id'], 0),
            formatdates: true,
            onlysections: []
        };

        Balboa.api('/calendar/dashboard', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Dashboard Data'), null);
        });
    }, (data) => {
        return `${data.sid.toString()}_${data.company_id || 2}`;
    });

    RadioService(RADIOS.services.LOAD_CALENDAR, (data, callback) => {
        let params = {
            include_details: true,
            formatdates: true,
            exclude_event_types: []
        };

        params = _.assign(params, data, SharedParams);

        Balboa.api('/calendar', params, (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Calendar Data'), null);
        });
    }, (data) => {
        return RADIOS.services.LOAD_CALENDAR;
    });
};

export default {
    init
}