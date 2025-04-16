/**
 * Creates an ContinueCancelDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ContinueCancelDialogFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // MUI
    const Dialog = require('material-ui/Dialog').default;
    const FlatButton = require('material-ui/FlatButton').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        closeDialog
    } = DialogActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _continueHandler;
    let _cancelHandler;

    /**
     *
     * @param inst
     * @private
     */
    _cancelHandler = (inst) => {
        const {
            dispatch,
            dialogItem
        } = inst.props;

        const onCancel = dialogItem.get('onCancel');

        dispatch(closeDialog());

        if (onCancel) {
            onCancel.call();
        }
    };

    /**
     *
     * @param inst
     * @private
     */
    _continueHandler = (inst) => {
        const {
            dispatch,
            dialogItem
        } = inst.props;

        const onContinue = dialogItem.get('onContinue');

        dispatch(closeDialog());

        if (onContinue) {
            onContinue.call();
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            widgetId: PropTypes.string.isRequired,
            dialogItem: PropTypes.object.isRequired,
            continueText: PropTypes.string,
            cancelText: PropTypes.string,
            displayMode: PropTypes.string,
            animate: PropTypes.string
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'ContinueCancelDialog',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates HTML/DOM
         *
         * @return {function|XML|JSX}
         */
        render() {
            const {
                widgetId,
                children,
                continueText,
                cancelText,
                dialogItem
            } = this.props;

            const show = dialogItem.get('show');
            const onCancel = dialogItem.get('onCancel');
            const text = dialogItem.get('text');

            return <Dialog
                ref={widgetId}
                open={show}
                actions={
                    [<FlatButton
                        label={(cancelText || getText('Cancel')).toUpperCase()}
                        primary={true}
                        onClick={(e) => {
                            stopProp(e);

                            _cancelHandler(this);
                        }}/>,
                        <FlatButton
                            label={(continueText || getText('Continue')).toUpperCase()}
                            primary={true}
                            onClick={(e) => {
                                stopProp(e);

                                _continueHandler(this);
                            }}
                        />]}>

                {
                    text || children
                }

            </Dialog>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContinueCancelDialogFactory }