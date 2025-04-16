/**
 * Creates an ExitDirtyConfirmationDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ExitDirtyConfirmationDialogFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {ContinueCancelDialogFactory} = require('./ContinueCancelDialog');

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../../mixins/AutoShouldUpdateMixin').default;

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        TranslateActionsFactory,
        ViewActionsFactory
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
        getText
    } = TranslateActionsFactory({});

    const {
        doSubmitForm
    } = ViewActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const ContinueCancelDialog = ContinueCancelDialogFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dialogItem: PropTypes.object.isRequired
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
        displayName: 'ExitDirtyConfirmationDialog',
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
                dialogItem,
                dispatch
            } = this.props;

            const text = dialogItem.get('text');

            return <ContinueCancelDialog
                widgetId='exit-dirty-confirmation-dialog'
                continueText={getText('Lose Changes')}
                cancelText={getText('Save')}
                displayMode='bottom'
                animate='slideup'
                {...this.props}>

                {
                    text || getText('By leaving this screen you will discard all changes.  Continue?')
                }

            </ContinueCancelDialog>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ExitDirtyConfirmationDialogFactory }