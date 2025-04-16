/**
 * Creates an ConfirmedEventsDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ConfirmedEventsDialogFactory = (spec = {}) => {
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
        displayName: 'ConfirmedEventsDialog',
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

            const text = dialogItem.get('text');

            return <ContinueCancelDialog
                widgetId='confirmed-events-dialog'
                continueText={getText('Take Me')}
                cancelText={getText('OK')}
                displayMode='bottom'
                animate='slideup'
                {...this.props}>

                {
                    text || getText('Jobs with an accepted offer are displayed in your calendar with your other events.')
                }

            </ContinueCancelDialog>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ConfirmedEventsDialogFactory }