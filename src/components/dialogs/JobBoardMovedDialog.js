import {EventActionsFactory} from "../../actions";

/**
 * Creates an JobBoardMovedDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobBoardMovedDialogFactory = (spec = {}) => {
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
    const Dialog = require('material-ui/Dialog').default;
    const FlatButton = require('material-ui/FlatButton').default;

    // Factories

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../../mixins/AutoShouldUpdateMixin').default;

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        DialogActionsFactory
    } = require('../../actions');

    const {
        closeDialog
    } = DialogActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/
    let _cancelHandler;

    /**
     *
     * @param inst
     * @private
     */
    _cancelHandler = (inst) => {
        const {
            dispatch,
        } = inst.props;

        dispatch(closeDialog());
    };
    /**********************************
     * Actions
     *********************************/

    /**********************************
     * Factories
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dialogItem: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            auth: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    const component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'JobBoardMovedDialog',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {function|JSX|XML}
         */
        render() {
            const {
                dialogItem
            } = this.props;
            const show = dialogItem.get('show');

            return <Dialog
              ref={'job-board-moved-dialog'}
              open={show}
              displayMode='bottom'
              animate='slideup'
              actions={
                  [<FlatButton
                    label={'OK'}
                    primary={true}
                    onClick={(e) => {
                        stopProp(e);
                        _cancelHandler(this);
                    }}/>]}
            >
                The Job Board has moved to the <b>Lead Center</b> in your eSpeakers Profile dashboard.
            </Dialog>
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobBoardMovedDialogFactory }