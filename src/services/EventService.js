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
const esUtils = require('ES/utils/esUtils');

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
    RadioService(RADIOS.services.LOAD_EVENT, (data, callback) => {
        Balboa.api(`/event/read/${data.eid}`, SharedParams, (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Event'), null);
        });
    }, (data) => {
        return data.eid.toString();
    });

    RadioService(RADIOS.services.SAVE_EVENT, (data, callback) => {
        let event = esUtils.convertJSEventToBalboa3Event(data.event);

        if (event === null) {
            return;
        }
        Balboa.api(`/event/update/${event.eid}`, _.assign({
            event_json: event
        }, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Save Event'), null);
        });
    }, (data) => {
        return data.event.eid.toString();
    });

    RadioService(RADIOS.services.DELETE_EVENT, (data, callback) => {
        Balboa.api(`/event/destroy/${data.eid}`, _.assign({
            confirm: 'y'
        }, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Delete Event'), null);
        });
    }, (data) => {
        return data.eid;
    });

    RadioService(RADIOS.services.COPY_EVENT, (data, callback) => {
        Balboa.api(`/event/copyevent/${data.eid}`, _.assign({
            target_sid: data.targetSid,
            copylists: data.copyLists
        }, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.event_id);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Copy Event'), null);
        });
    }, (data) => {
        return data.eid;
    });

    RadioService(RADIOS.services.EMAIL_COWORKERS, (data, callback) => {
        let params = _.pick(data, ['subject', 'note', 'coworkers']);

        Balboa.api(`/event/emailtocoworkers/${data.eid}`, _.assign(params, SharedParams),
            (successResponse) => {
                if (successResponse.success === true) {
                    callback(null, true);
                } else {
                    callback(successResponse.message, null);
                }
            }, (failureResponse) => {
                callback((failureResponse && failureResponse.message) || getText('Failed to Email Coworkers'), null);
            });
    }, (data) => {
        return `${RADIOS.services.EMAIL_COWORKERS}-${data.eid}`;
    });
};

export default {
    init
}