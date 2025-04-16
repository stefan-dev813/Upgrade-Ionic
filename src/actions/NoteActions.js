/**
 * Generates the Note Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const NoteActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Actions
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _saveNote;
    let _selectNote;

    /**
     * Adds or Saves a note to the existing collection, unpersisted with server
     *
     * @param {object} note
     * @private
     */
    _saveNote = (note) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_NOTE,
            payload: note
        };
    };

    /**
     * Updates the store with the selected Note object and navigates to the subview
     *
     * @param {object} data
     * @private
     */
    _selectNote = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_NOTE,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.NOTE_VIEW
            }
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        saveNote: _saveNote,
        selectNote: _selectNote
    };
}

export default NoteActionsFactory;