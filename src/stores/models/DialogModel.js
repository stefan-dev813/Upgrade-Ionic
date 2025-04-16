/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const {Record} = require('immutable');

// Models
const DialogItemModel = require('./DialogItemModel').default;

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Record({
    undoConfirmation: DialogItemModel(),
    exitDirtyConfirmation: DialogItemModel(),
    deleteConfirmation: DialogItemModel(),
    copyEventConfirmation: DialogItemModel(),
    confirmedEventsDialog: DialogItemModel(),
    jobBoardMovedDialog: DialogItemModel(),
    showLegend: false,
    showSpeakerSelector: DialogItemModel()
});