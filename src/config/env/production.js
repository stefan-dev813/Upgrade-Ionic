const _ = require('lodash');

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
    serviceUrl: 'https://192.168.56.101/balboa3'
});