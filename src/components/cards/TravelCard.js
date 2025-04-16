/**
 * Creates and TravelCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const TravelCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {TravelFlightCardFactory} = require('./TravelFlightCard');
    const {TravelGroundCardFactory} = require('./TravelGroundCard');
    const {TravelHotelCardFactory} = require('./TravelHotelCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Components
     *********************************/

    const TravelFlightCard = TravelFlightCardFactory({});
    const TravelGroundCard = TravelGroundCardFactory({});
    const TravelHotelCard = TravelHotelCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            travel: PropTypes.object.isRequired,
            showDetails: PropTypes.bool
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
        displayName: 'TravelCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                showDetails: false
            };
        },
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                travel
            } = this.props;

            if (travel.get('flight')) {
                return <TravelFlightCard {...this.props}/>;
            }

            if (travel.get('ground')) {
                return <TravelGroundCard {...this.props}/>;
            }

            if (travel.get('hotel')) {
                return <TravelHotelCard {...this.props}/>;
            }
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TravelCardFactory }