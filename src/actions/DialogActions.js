import _ from "lodash";

/**
 * Generates the Dialog Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DialogActionsFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Methods
    //---------------------------------

    let closeDialog;
    let showConfirmedEventsDialog;
    let showJobBoardMovedDialog;
    let showCopyEventConfirmation;
    let showDeleteConfirmation;
    let showExitDirtyConfirmation;
    let showLegend;
    let showSpeakerSelector;
    let showUndoConfirmation;
    let updatedDialogStore;

    /**
     * Handles the closeDialog action
     *
     * @private
     */
    closeDialog = () => {
        return {
            type: RADIOS.stores.DIALOG_STORE_CLOSE_DIALOG
        };
    };

    showConfirmedEventsDialog = (spec = {}) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                confirmedEventsDialog: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    showJobBoardMovedDialog = (spec = {}) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                jobBoardMovedDialog: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the showCopyEventConfirmation Action
     *
     * @param {object} spec - Additional, optional settings
     * @property {function} spec.onContinue
     * @property {function} spec.onCancel
     * @property {string} spec.text
     * @private
     */
    showCopyEventConfirmation = (spec) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                copyEventConfirmation: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the showDeleteConfirmation Action
     *
     * @param {object} spec - Additional, optional settings
     * @property {function} spec.onContinue
     * @property {function} spec.onCancel
     * @property {string} spec.text
     * @private
     */
    showDeleteConfirmation = (spec) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                deleteConfirmation: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the showExitDirtyConfirmation Action
     *
     * @param {object} spec - Additional, optional settings
     * @property {function} spec.onContinue
     * @property {function} spec.onCancel
     * @property {string} spec.text
     * @private
     */
    showExitDirtyConfirmation = (spec) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                exitDirtyConfirmation: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the showLegend action
     *
     * @private
     */
    showLegend = () => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                showLegend: true
            }
        };
    };

    /**
     * Handles the showSpeakerSelector action
     *
     * @private
     */
    showSpeakerSelector = (spec) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                showSpeakerSelector: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the showUndoConfirmation Action
     *
     * @param {object} spec - Additional, optional settings
     * @property {function} spec.onContinue
     * @property {function} spec.onCancel
     * @property {string} spec.text
     * @private
     */
    showUndoConfirmation = (spec) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: {
                undoConfirmation: _.assign({
                    show: true
                }, spec)
            }
        };
    };

    /**
     * Handles the updatedDialogStore action
     *
     * @param data
     * @private
     */
    updatedDialogStore = (data) => {
        return {
            type: RADIOS.stores.DIALOG_STORE_UPDATE,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        closeDialog,
        showConfirmedEventsDialog,
        showJobBoardMovedDialog,
        showCopyEventConfirmation,
        showDeleteConfirmation,
        showExitDirtyConfirmation,
        showLegend,
        showSpeakerSelector,
        showUndoConfirmation,
        updatedDialogStore
    };
}

export default DialogActionsFactory;