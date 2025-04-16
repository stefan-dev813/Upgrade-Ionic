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
    RadioService(RADIOS.services.LOAD_JOB_BOARD, (data, callback) => {

        let params = {
        };

        Balboa.api('/search/jobboard', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Job Board'), null);
        });
    }, (data) => {
        return RADIOS.services.LOAD_JOB_BOARD;
    });

    RadioService(RADIOS.services.LOAD_JOB_AGREEMENT, (data, callback) => {

        let params = _.pick(data, ['event_id', 'speaker_id']);

        Balboa.api('/mpagreement/read', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Job Agreement'), null);
        });
    }, (data) => {
        return `${data.speaker_id}:${data.event_id}`;
    });

    RadioService(RADIOS.services.LOAD_JOB_EVENT, (data, callback) => {

        let params = _.pick(data, ['event_id']);

        Balboa.api(`/event/read/${params.event_id}`, _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Job Details'), null);
        });
    }, (data) => {
        return `${data.event_id}`;
    });

    RadioService(RADIOS.services.LOAD_JOB_MESSAGES, (data, callback) => {

        let params = _.pick(data, ['event_id']);

        Balboa.api('/mpmessage/read', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {

                let message_ids = _.reduce(successResponse.messages, (list, message) => {
                    if(!(message.sender_speaker_id > 0) && !message.receiver_opened) {
                        list.push(message.id);
                    }

                    return list;
                }, []);

                if(!_.isEmpty(message_ids)) {
                    radio(RADIOS.services.READ_JOB_MESSAGES).broadcast({
                        message_ids
                    });
                }

                callback(null, {
                    sid: data.sid,
                    event_id: data.event_id,
                    messages: successResponse.messages
                });
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Load Job Messages'), null);
        });
    }, (data) => {
        return `${data.event_id}`;
    });

    RadioService(RADIOS.services.READ_JOB_MESSAGES, (data, callback) => {
        Balboa.api("/mpmessage/ireadit", {
            ids: data.message_ids
        }, (successResponse) => {
            radio(RADIOS.services.LOAD_JOB_BOARD).broadcast();
            callback(null, successResponse);
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to mark messages as read'), null);
        });
    }, (data) => {
        return RADIOS.services.LOAD_JOB_MESSAGES;
    });

    RadioService(RADIOS.services.SEND_JOB_MESSAGE, (data, callback) => {
        let params = {
            content: data.msg,
            event_id: data.eid,
            speaker_id: data.sid
        };

        Balboa.api('/mpmessage/sendtobuyer', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.message);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Send Job Messages'), null);
        });
    }, (data) => {
        return `${data.eid}-${data.sid}`;
    });

    RadioService(RADIOS.services.GET_SHORT_PROFILE, (data, callback) => {
        let params =  {
            speaker_ids: data.sid
        };

        Balboa.api('/speaker/shortprofile', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.data);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Get Short Profile'), null);
        });
    }, (data) => {
        return data.sid;
    });

    RadioService(RADIOS.services.SEND_JOB_APPLICATION, (data, callback) => {
        let params = {
            content: data.content,
            event_id: data.eid,
            speaker_id: data.sid,
            agreement: data.agreement
        };

        Balboa.api('/mpmessage/applytopublicjob', _.assign(params, SharedParams), (successResponse) => {
            if (successResponse.success === true) {
                callback(null, successResponse.message);
            } else {
                callback(successResponse.message, null);
            }
        }, (failureResponse) => {
            callback((failureResponse && failureResponse.message) || getText('Failed to Apply to Job'), null);
        });
    }, (data) => {
        return `${data.eid}-${data.sid}`;
    });
};

const calls = {};
calls[RADIOS.services.LOAD_JOB_BOARD] = (params, callback) => {

    Balboa.api('/search/jobboard', _.assign(params, SharedParams), (successResponse) => {
        if (successResponse.success === true) {
            callback(null, successResponse.data);
        } else {
            callback(successResponse.message, null);
        }
    }, (failureResponse) => {
        callback((failureResponse && failureResponse.message) || getText('Failed to Load Job Board'), null);
    });
};

export default {
    init,
    calls
}