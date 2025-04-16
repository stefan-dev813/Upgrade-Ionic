/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const Immutable = require('immutable');

const TodoViewModel = require('./TodoViewModel').default;

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Immutable.Record({
    dirty: false,
    actions: Immutable.List(),
    headerText: undefined,
    todoView: TodoViewModel,
    doSubmitForm: false,
    doSubmitFormCallback: undefined,
    keyboardActive: false
});