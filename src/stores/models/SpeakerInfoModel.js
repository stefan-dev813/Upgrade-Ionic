/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const Immutable = require('immutable');


/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Immutable.Record({
    speakerMode: '',
    selectedSpeaker: undefined,
    speakerList: Immutable.List()
});