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
    selectedYear: undefined,
    selectedMonth: undefined,
    selectedDay: undefined,
    selectorYear: undefined,
    calendarData: Immutable.Map(),
    calendarDetails: Immutable.Map()
});