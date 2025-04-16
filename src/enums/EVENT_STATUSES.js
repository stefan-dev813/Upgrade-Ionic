/**************************************************************************
 *
 * Imports
 *
 *************************************************************************/

const _ = require('lodash');

/**************************************************************************
 *
 * Private Members
 *
 *************************************************************************/

/**************************************
 * Variables
 *************************************/

const EVENT_STATUSES = {//TODO keep in sync with class.Event.php
    held: 0,
    confirmed: 1,
    canceled: 9,
    lead: 10,
    zimbra: 11,
    postponed: 12,
    closed: 13
};

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/

export default {
    EVENT_STATUSES,
    EVENT_STATUSES_by_num: _.fromPairs(_.map(_.toPairs(EVENT_STATUSES), (pair) => {
        return pair.reverse();
    })),

    EVENT_STATUS_PRIORITY: {canceled: 0, closed: 1, postponed: 2, lead: 3, held: 4, confirmed: 5}
};

