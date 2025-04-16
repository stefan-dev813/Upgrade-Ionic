/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const EventCalendarFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');
    const moment = require('moment');
    const Hammer = require('react-hammerjs');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {CalendarDayFactory} = require('./CalendarDay');
    const {CalendarHeaderFactory} = require('./CalendarHeader');
    const {MonthSelectorFactory} = require('./MonthSelector');

    // Theme
    const IconMap = require('../../theme/IconMap');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        CalendarActionsFactory
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
        prevMonth,
        updateSelectorYear
    } = CalendarActionsFactory({});

    /*********************************
     * Methods
     ********************************/

    let _selectorToggleHandler;
    let _swipeHandler;
    let _weeksHaveMoreThanOneSID;

    /**
     *
     * @param open
     * @param inst
     * @private
     */
    _selectorToggleHandler = (open, inst) => {
        const {
            dispatch
        } = inst.props;

        inst.setState({
            showSelector: open
        });

        if (!open) {
            dispatch(updateSelectorYear({
                selectorYear: undefined
            }));
        }
    };

    /**
     *
     * @param event
     * @private
     */
    _swipeHandler = (event, inst) => {
        const {
            dispatch
        } = inst.props;

        if (event.deltaX < -50) {
            dispatch(nextMonth());
        } else if (event.deltaX > 50) {
            dispatch(prevMonth());
        }
    };

    /**
     *
     * @param cal_details
     * @param cal_data
     * @param weeks
     * @returns {*}
     * @private
     */
    _weeksHaveMoreThanOneSID = (cal_details, cal_data, weeks) => {
        let da_one_sid = undefined;
        return _.some(weeks, (week) => {
            return _.some(week, (day) => {
                let day_data = _.has(cal_data, day.date) ? cal_data[day.date] : {};
                return _.some(day_data.detail_ids, (detail_id) => {
                    let e = cal_details && cal_details[detail_id];
                    return _.some(e && e.sids, (sid) => {
                        let id = _.parseInt(sid, 10);
                        if (da_one_sid === undefined) {
                            da_one_sid = id;
                        } else if ((id > 0) && da_one_sid !== id) {
                            //we found more than one sid
                            return true;
                        }
                        return false;
                    });
                });
            });
        });
    };

    /**********************************
     * Components
     *********************************/

    const CalendarHeader = CalendarHeaderFactory({});
    const CalendarDay = CalendarDayFactory({});
    const MonthSelector = MonthSelectorFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messages
         */
        displayName: 'EventCalendar',

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
                showEvents: false,
                showSelector: false
            };
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                calendar,
                displayData
            } = this.props;

            const {
                showEvents,
                showSelector
            } = this.state;

            const calendarData = calendar.get('calendarData');
            const selectedMonth = calendar.get('selectedMonth');
            const selectedYear = calendar.get('selectedYear');
            const currentData = calendarData.get(`${selectedYear}-${selectedMonth}`);

            // const {year, month, cal_details, cal_data, Displaylists} = this.props;
            const weeks = esUtils.build_calendar_weeks(selectedYear, selectedMonth, true);
            let isMultiSidMode = false;

            if (currentData) {
                isMultiSidMode = _weeksHaveMoreThanOneSID(currentData.get('details').toJS(), currentData.get('calendar').toJS(), weeks);
            }

            if (showEvents) {

            }

            if (showSelector) {
                return <MonthSelector onSelectorClose={() => {
                    _selectorToggleHandler(false, this);
                }}/>;
            }

            return (
                <div>
                    {/*<Hammer onSwipe={(event) => {*/}
                    {/*    _swipeHandler(event, this);*/}
                    {/*}}>*/}
                        <table style={{
                            width: '100%'
                        }}>
                            <thead>
                            <CalendarHeader
                                onSelectorOpen={() => {
                                    _selectorToggleHandler(true, this);
                                }}/>
                            <tr>
                                {_.map(_.range(1, 8), (d) => {
                                    return (
                                        <th key={d} className="dow text-center">
                                            {esUtils.get_day_of_week(d, true)}
                                        </th>
                                    );
                                })}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(weeks, (week, i) => {
                                    return <tr key={i}>
                                        {_.map(week, (day, i) => {
                                            return <CalendarDay
                                                key={i}
                                                day={day}
                                                isMultiSidMode={isMultiSidMode}
                                            />;
                                        })}
                                    </tr>;
                                })
                            }
                            </tbody>
                        </table>
                    {/*</Hammer>*/}
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { EventCalendarFactory }


