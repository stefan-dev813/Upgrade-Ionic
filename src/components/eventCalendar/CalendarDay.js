/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const CalendarDayFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Enums
    const EVENT_STATUSES = require('../../enums/EVENT_STATUSES').default;

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const {fade}  = require('material-ui/utils/colorManipulator');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

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
        extractMonthData,
        selectDay
    } = CalendarActionsFactory({});

    const {
        stopProp
    } = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _showDayEvents;

    /**
     *
     * @param inst
     * @private
     */
    _showDayEvents = (inst, details) => {
        const {
            day,
            dispatch
        } = inst.props;

        if (!details || !details.length)
            return;

        dispatch(selectDay(_.get(day, ["date"])));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            day: PropTypes.shape({
                date: PropTypes.number.isRequired,
                out_of_month: PropTypes.bool
            }).isRequired,
            displayData: PropTypes.object.isRequired,
            isMultiSidMode: PropTypes.bool.isRequired
        }
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
        displayName: 'CalendarDay',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                calendar,
                day,
                displayData
            } = this.props;

            let calData;
            let calDetails;
            let details;
            let dayData;
            let dayStatus;
            let isPersonal;
            let decorators = [];

            const monthData = extractMonthData(calendar);

            // Styles

            const tdBaseStyle = {
                textAlign: 'center',
                width: '56px'
            };

            const spanBaseStyle = {
                borderRadius: '50%',
                display: 'inline-block',
                padding: '5px',
                minHeight: '18px',
                minWidth: '18px',
                width: '36px',
                height: '36px',
                lineHeight: '26px'
            };

            const baseDecoratorStyle = {
                display: 'none',
                width: '5px',
                height: '4px',
                borderRadius: '12px',
                padding: '3px',
                position: 'relative'
            };

            let tdAppliedStyle = _.assign({}, tdBaseStyle);
            let spanAppliedStyle = _.assign({}, spanBaseStyle);

            let appliedCallStyle = _.assign({}, baseDecoratorStyle, {
                background: mainTheme.callColor,
                top: '-10px',
                right: '8px'
            });

            let appliedDailyStyle = _.assign({}, baseDecoratorStyle, {
                background: mainTheme.dailyColor,
                top: '10px',
                right: '8px'
            });

            let appliedTravelStyle = _.assign({}, baseDecoratorStyle, {
                background: mainTheme.travelColor,
                top: '10px',
                left: '8px'
            });

            let appliedCoachingStyle = _.assign({}, baseDecoratorStyle, {
                background: mainTheme.coachingColor,
                top: '-10px',
                left: '8px'
            });

            if (day.out_of_month) {
                tdAppliedStyle = _.assign(tdAppliedStyle, {
                    color: 'rgba(0, 0, 0, 0.2)'
                });
            }

            // Process calendar data

            if (monthData && !day.out_of_month) {
                calData = monthData.data;
                calDetails = monthData.details;

                dayData = _.has(calData, day.date) ? calData[day.date] : {};

                details = _.uniq(_.reject(_.map(dayData.detail_ids, (detail_id) => {
                    return calDetails && calDetails[detail_id];
                }), _.isEmpty), (detail) => {
                    if (detail.eid && detail.eid > 0) {
                        return detail.eid;
                    }
                    return [detail.desc, detail.type].join("$");
                });
            }

            // Determine Event Status

            dayStatus = -1;
            isPersonal = false;
            _.each(details, (detail) => {
                if ((detail.type === "event") && ((dayStatus < 0) || (EVENT_STATUSES.EVENT_STATUS_PRIORITY[detail.sta] > EVENT_STATUSES.EVENT_STATUS_PRIORITY[EVENT_STATUSES.EVENT_STATUSES_by_num[dayStatus]]))) {
                    dayStatus = EVENT_STATUSES.EVENT_STATUSES[detail.sta];
                }

                isPersonal = detail.psnl;
            });

            if (dayStatus > -1) {
                let bgColor = mainTheme[`${EVENT_STATUSES.EVENT_STATUSES_by_num[dayStatus]}Color`];
                let fontColor = mainTheme[`${EVENT_STATUSES.EVENT_STATUSES_by_num[dayStatus]}FontColor`];
                let personalFontColor = mainTheme[`${EVENT_STATUSES.EVENT_STATUSES_by_num[dayStatus]}PersonalFontColor`];

                spanAppliedStyle = _.assign(spanAppliedStyle, {
                    backgroundColor: bgColor,
                    color: mainTheme[`${EVENT_STATUSES.EVENT_STATUSES_by_num[dayStatus]}FontColor`]
                });

                if (isPersonal) {
                    let fader = fade(bgColor, 2);
                    spanAppliedStyle = _.assign(spanAppliedStyle, {
                        color: (personalFontColor ? personalFontColor : mainTheme.calendarFontColor),
                        backgroundColor: fade(bgColor, 0.3),
                        border: `4px solid ${fader}`,
                        padding: '3px'
                    });
                }
            }

            // Proccess Decorators

            if (_.has(dayData, 'decorators')) {
                _.map(dayData.decorators, (decorator) => {
                    if (decorator === 'call') {
                        appliedCallStyle = _.assign(appliedCallStyle, {
                            display: 'block'
                        });
                    } else if (decorator === 'coaching') {
                        appliedCoachingStyle = _.assign(appliedCoachingStyle, {
                            display: 'block'
                        });
                    } else if (decorator === 'daily') {
                        appliedDailyStyle = _.assign(appliedDailyStyle, {
                            display: 'block'
                        });
                    } else if (decorator === 'travel' || decorator === 'flight' || decorator === 'ground') {
                        appliedTravelStyle = _.assign(appliedTravelStyle, {
                            display: 'block'
                        });
                    }
                });
            }

            return (
                <td style={tdAppliedStyle} onClick={(e) => {
                    stopProp(e);

                    _showDayEvents(this, details);
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            order: 1,
                            display: 'flex'
                        }}>
                            <div style={{
                                order: 1,
                                flexGrow: 0,
                                flexShrink: 0,
                                width: '10px',
                                height: '10px'
                            }}>
                                <div style={appliedTravelStyle}>&nbsp;</div>
                            </div>

                            <div style={{
                                order: 2,
                                flexGrow: 1,
                                flexShrink: 1
                            }}></div>

                            <div style={{
                                order: 3,
                                flexGrow: 0,
                                flexShrink: 0,
                                width: '10px',
                                height: '10px'
                            }}>
                                <div style={appliedDailyStyle}>&nbsp;</div>
                            </div>
                        </div>

                        <div style={{
                            order: 2,
                            display: 'flex',
                            flexGrow: 1,
                            flexShrink: 1,
                            margin: 'auto'
                        }}>
                            <span style={spanAppliedStyle}>
                                {day.date}
                            </span>
                        </div>

                        <div style={{
                            order: 3,
                            display: 'flex'
                        }}>
                            <div style={{
                                order: 1,
                                flexGrow: 0,
                                flexShrink: 0,
                                width: '10px',
                                height: '10px'
                            }}>
                                <div style={appliedCoachingStyle}>&nbsp;</div>
                            </div>

                            <div style={{
                                order: 2,
                                flexGrow: 1,
                                flexShrink: 1
                            }}></div>

                            <div style={{
                                order: 3,
                                flexGrow: 0,
                                flexShrink: 0,
                                width: '10px',
                                height: '10px'
                            }}>
                                <div style={appliedCallStyle}>&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </td>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CalendarDayFactory }