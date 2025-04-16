/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const {Map, Record} = require('immutable');


/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
// TODO: refactor this to be flattend up on EventModel with the other "selected" items
export default Record({
    todoUndo: Map()
});