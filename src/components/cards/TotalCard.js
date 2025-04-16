/**
 * Creates and TotalCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const TotalCardFactory = (spec) => {

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

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    const esUtils = require('ES/utils/esUtils');

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
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            total: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired,
            description: PropTypes.string
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
        displayName: 'TotalCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            let {
                total,
                description
            } = this.props;

            if (_.isNumber(total)) {
                total = esUtils.format_currency(total, 2);
            }

            return <ListCard
                leftAvatarIcon="attach-money"
                primaryText={getText('Total')}
                secondaryText={[total, description]}
            />;
        }
    });
}

export { TotalCardFactory }