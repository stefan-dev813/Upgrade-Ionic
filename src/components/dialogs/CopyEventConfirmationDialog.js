/**
 * Creates an CopyEventConfirmationDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const CopyEventConfirmationDialogFactory = (spec) => {
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
    const Toggle = require('material-ui/Toggle').default;

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
     * Methods
     *********************************/

    let _cancelHandler;
    let _continueHandler;

    /**
     * Handles the Cancel button of the Widget
     *
     * @param {object} inst - Reference to React Component Instance
     * @private
     */
    _cancelHandler = (inst) => {
        const {
            dialogItem,
            dispatch
        } = inst.props;

        const onCancel = dialogItem.get('onCancel');

        dispatch(closeDialog());

        if (onCancel) {
            onCancel.call();
        }
    };

    /**
     * Hnaldes the Copy button of the Widget
     *
     * @param {object} inst - Reference to React Component Instance
     * @private
     */
    _continueHandler = (inst) => {
        const {
            dialogItem,
            dispatch
        } = inst.props;
        const {
            checked
        } = inst.state;

        const onContinue = dialogItem.get('onContinue');

        dispatch(closeDialog());

        if (onContinue) {
            onContinue(checked);
        }
    };

    /**********************************
     * Factories
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dialogItem: PropTypes.object.isRequired
        },
        compareState: true
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
        displayName: 'CopyEventConfirmationDialog',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                checked: true
            };
        },

        /**
         * Generates HTML/DOM
         *
         * @return {function|XML|JSX}
         */
        render() {
            const {
                dialogItem
            } = this.props;
            const {
                checked
            } = this.state;

            const show = dialogItem.get('show');

            return <Dialog
                title={getText('Duplicate Event')}
                open={show}
                actions={
                    [<FlatButton
                        label={getText('Copy')}
                        primary={true}
                        onClick={(e) => {
                            stopProp(e);

                            _continueHandler(this);
                        }}/>,
                        <FlatButton
                            label={getText('Cancel')}
                            primary={true}
                            onClick={(e) => {
                                stopProp(e);

                                _cancelHandler(this);
                            }}/>]
                }>

                <Toggle
                    label={getText('Copy Lists')}
                    toggled={checked}
                    onToggle={(e, v) => {
                        this.setState({
                            checked: v
                        });
                    }}/>

                {getText('(services, contacts, actions, etc...)')}

            </Dialog>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CopyEventConfirmationDialogFactory }