/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
// Node Modules
const _ = require('lodash');
const local = require('./local');
const shared = require('./shared');

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default _.assign({}, shared, {
    logging: {
        enabled: true
    },
    serviceUrl: 'https://local.espeakers.com/balboa3'
}, local);