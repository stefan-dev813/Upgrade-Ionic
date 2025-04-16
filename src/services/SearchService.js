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

// Utilites
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
    RadioService(RADIOS.services.SEARCH_EVENTS, (data, callback) => {

        let params = {
            sids: [data.sid],
            searchterm: data.search,
            deepsearch: data.deepSearch || false,
            marketplaceonly: data.marketplaceOnly ? 1 : 0,
            futureonly: data.futureOnly ? 1 : 0,
            datelessonly: data.onlyDatelessEvents ? 'true' : 'false',
            exclude_event_types: data.excludeEventTypes,
            formatdates: true
        };

        Balboa.api('/search', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Search Events'), null);
        });
    }, (data) => {
        return data.sid.toString();
    });
};

export default {
    init
}