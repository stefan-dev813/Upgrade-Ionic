/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

const {List, Record, Map} = require('immutable');

const JobModel = require('./JobModel').default;

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/

export default Record({
    sids_connected_to_stripe: List(),
    per_sid: Map(),
    jobs: List(),
    selectedJob: JobModel(),
    lastUpdated: undefined
});