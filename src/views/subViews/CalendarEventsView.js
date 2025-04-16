/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const CalendarEventsViewFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const _ = require('lodash');
    const moment = require('moment');

        // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {
        CalendarEventListFactory
    } = require('../../components/list');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Components
     *********************************/

    const CalendarEventList = CalendarEventListFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    let component = createClass(_.assign({
        /**
         * Used in debug messages
         */
        displayName: 'CalendarEventsView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {XML}
         */
        render() {
            const {calendar} = this.props;
            return (
                <div>
                    <CalendarEventList calendar={calendar} />
                </div>
            );
        }
    }, ViewMixin, {
        getHeaderText() {
            const {
                calendar
            } = this.props;

            const selectedYear = calendar.get('selectedYear');
            const selectedMonth = calendar.get('selectedMonth');
            const selectedDay = calendar.get('selectedDay');

            const fullDate = moment(`${selectedYear}-${selectedMonth}-${selectedDay}`, 'YYYY-MM-DD');
            const formattedDate = fullDate.format('MMM Do, dddd');
            return formattedDate;
        }
    }));

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CalendarEventsViewFactory }