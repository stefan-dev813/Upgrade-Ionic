/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const {Record} = require('immutable');


/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Record({
    dirty: false,
    selectedEvent: undefined,
    modifiedEvent: undefined,
    selectedTodo: undefined,
    selectedContact: undefined,
    selectedNote: undefined,
    selectedProduct: undefined,
    selectedService: undefined,
    selectedStageTime: undefined
});