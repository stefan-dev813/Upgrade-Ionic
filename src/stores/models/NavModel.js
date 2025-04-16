/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const { List, Record } = require('immutable');


/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Record({
    mainView: undefined,
    eventView: undefined,
    subView: List(),
    onReturn: undefined,
    showDrawer: false,
    changeStamp: 0,
    onBack: undefined
});