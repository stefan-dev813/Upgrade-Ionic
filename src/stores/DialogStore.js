import _ from "lodash";

/**
 * Creates an DialogStore.  Handles all state changes to the dialog
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DialogStoreFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const {fromJS} = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Models
    const DialogModel = require('./models/DialogModel').default;
    const DialogItemModel = require('./models/DialogItemModel').default;

    // Utils
    const {log} = require('../util/DevTools').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Variables
    //---------------------------------

    /**
     *
     * @returns {Record|DialogModel}
     * @private
     */
    const _initialState = () => {
        return new DialogModel();
    };

    //---------------------------------
    // Methods
    //---------------------------------

    let _closeDialog;
    let _updateStore;

    /**
     *
     * @returns {Record|DialogModel}
     * @private
     */
    _closeDialog = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|DialogModel} dialog
     * @return {Record|DialogModel}
     * @private
     */
    _updateStore = (payload, dialog) => {
        let updatedModel = dialog;

        if (_.has(payload, 'undoConfirmation')) {
            updatedModel = updatedModel.set('undoConfirmation', new DialogItemModel(payload.undoConfirmation));
        }

        if (_.has(payload, 'exitDirtyConfirmation')) {
            updatedModel = updatedModel.set('exitDirtyConfirmation', new DialogItemModel(payload.exitDirtyConfirmation));
        }

        if (_.has(payload, 'deleteConfirmation')) {
            updatedModel = updatedModel.set('deleteConfirmation', new DialogItemModel(payload.deleteConfirmation));
        }

        if (_.has(payload, 'copyEventConfirmation')) {
            updatedModel = updatedModel.set('copyEventConfirmation', new DialogItemModel(payload.copyEventConfirmation));
        }

        if (_.has(payload, 'showLegend')) {
            updatedModel = updatedModel.set('showLegend', payload.showLegend);
        }

        if (_.has(payload, 'showSpeakerSelector')) {
            updatedModel = updatedModel.set('showSpeakerSelector', new DialogItemModel(payload.showSpeakerSelector));
        }

        if (_.has(payload, 'confirmedEventsDialog')) {
            updatedModel = updatedModel.set('confirmedEventsDialog', new DialogItemModel(payload.confirmedEventsDialog));
        }

        if (_.has(payload, 'jobBoardMovedDialog')) {
            updatedModel = updatedModel.set('jobBoardMovedDialog', new DialogItemModel(payload.jobBoardMovedDialog));
        }

        return updatedModel;
    };

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    /**
     * Handles all store based radio calls and determines an action to take
     * if any.
     *
     * @param {null|Record|DialogModel} dialog
     * @param {object} action
     * @returns {Record|DialogModel}
     */
    return (dialog, action) => {
        if (!dialog) {
            dialog = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.DIALOG_STORE_UPDATE:
                return _updateStore(payload, dialog);
            case RADIOS.stores.DIALOG_STORE_CLOSE_DIALOG:
                return _closeDialog(payload, dialog);
        }

        return dialog;
    };
}

export {
    DialogStoreFactory
};