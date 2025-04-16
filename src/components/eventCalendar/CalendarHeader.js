/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const CalendarHeaderFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // React
    const React = require('react');
    const createClass = require('create-react-class');
	const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Theme
    const IconMap = require('../../theme/IconMap');

    // Utils
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        CalendarActionsFactory,
        EventActionsFactory
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
        nextMonth,
        prevMonth
    } = CalendarActionsFactory({});

    const {
        stopProp
    } = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _nextMonthHandler;
    let _prevMonthHandler;

    /**
     *
     * @param inst
     * @private
     */
    _nextMonthHandler = (inst) => {
        const {
            dispatch
        } = inst.props;


        dispatch(nextMonth());
    };

    /**
     *
     * @param inst
     * @private
     */
    _prevMonthHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(prevMonth());
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            onSelectorOpen: PropTypes.func.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    let component = createClass({

        displayName: 'CalendarHeader',

        mixins: [AutoShouldUpdateMixin],

        render() {
            const {
                calendar,
                onSelectorOpen
            } = this.props;

            const selectedMonth = calendar.get('selectedMonth');
            const selectedYear = calendar.get('selectedYear');

            return (
                <tr>
                    <th>{IconMap.getButton('chevron-left', {
                        onClick: (e) => {
                            stopProp(e);

                            _prevMonthHandler(this);
                        }
                    })}</th>

                    <th colSpan="5" onClick={(e) => {
                        stopProp(e);

                        onSelectorOpen();
                    }} className={"text-center"}>
                        {esUtils.get_month_name(selectedMonth)}
                        &nbsp;
                        {selectedYear}
                    </th>

                    <th>{IconMap.getButton('chevron-right', {
                        onClick: (e) => {
                            stopProp(e);

                            _nextMonthHandler(this);
                        }
                    })}</th>
                </tr>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CalendarHeaderFactory }