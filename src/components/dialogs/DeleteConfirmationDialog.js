/**
 * Creates an DeleteConfirmationDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const DeleteConfirmationDialogFactory = (spec) => {
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

    // Factories
    const {ContinueCancelDialogFactory} = require('./ContinueCancelDialog');

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

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'DeleteConfirmationDialog',
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
                dialogItem
            } = this.props;

            const text = dialogItem.get('text');

            return <ContinueCancelDialog {..._.assign({
                        widgetId: 'delete-confirmation-dialog',
                continueText: getText('Delete'),
                cancelText: getText('Cancel')
                    }, this.props)
                                         }>

                {
                    text || getText('Are you sure you want to delete?')
                }

            </ContinueCancelDialog>;
        }
    });
}

export { DeleteConfirmationDialogFactory }