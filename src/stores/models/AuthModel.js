/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const Immutable = require('immutable');
const PushModel = require('./PushModel').default;

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Immutable.Record({
    authedUserSession: undefined,
    sessionData: undefined,
    push: PushModel
});