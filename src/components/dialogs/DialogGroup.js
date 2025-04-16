import React from "react";
import {JobBoardMovedDialogFactory} from "./JobBoardMovedDialog";

/**
 * Creates a DialogGroup Component
 *
 * @param {object} spec
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const DialogGroupFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Dialogs
    const {ConfirmedEventsDialogFactory} = require('./ConfirmedEventsDialog');
    const {JobBoardMovedDialogFactory} = require('./JobBoardMovedDialog');
    const {CopyEventConfirmationDialogFactory} = require('./CopyEventConfirmationDialog');
    const {DeleteConfirmationDialogFactory} = require('./DeleteConfirmationDialog');
    const {ExitDirtyConfirmationDialogFactory} = require('./ExitDirtyConfirmationDialog');
    const {SpeakerSelectorDialogFactory} = require('./SpeakerSelectorDialog');
    const {UndoConfirmationDialogFactory} = require('./UndoConfirmationDialog');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Dialogs
    //---------------------------------

    const ConfirmedEventsDialog = ConfirmedEventsDialogFactory({});
    const JobBoardMovedDialog = JobBoardMovedDialogFactory({});
    const CopyEventConfirmationDialog = CopyEventConfirmationDialogFactory({});
    const DeleteConfirmationDialog = DeleteConfirmationDialogFactory({});
    const ExitDirtyConfirmationDialog = ExitDirtyConfirmationDialogFactory({});
    const SpeakerSelectorDialog = SpeakerSelectorDialogFactory({});
    const UndoConfirmationDialog = UndoConfirmationDialogFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dialog: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface / React Component
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'DialogGroup',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                dialog
            } = this.props;

            return (<div id="dialog-group">
                <CopyEventConfirmationDialog
                    dialogItem={dialog.get('copyEventConfirmation')}/>

                <UndoConfirmationDialog
                    dialogItem={dialog.get('undoConfirmation')}/>

                <ExitDirtyConfirmationDialog
                    dialogItem={dialog.get('exitDirtyConfirmation')}/>

                <DeleteConfirmationDialog
                    dialogItem={dialog.get('deleteConfirmation')}/>

                <ConfirmedEventsDialog
                    dialogItem={dialog.get('confirmedEventsDialog')}/>

                <JobBoardMovedDialog
                  dialogItem={dialog.get('jobBoardMovedDialog')}/>

                <SpeakerSelectorDialog
                  dialogItem={dialog.get('speakerSelectorDialog')}/>
            </div>);
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DialogGroupFactory }