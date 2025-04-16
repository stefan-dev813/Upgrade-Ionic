/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 * @returns {*}
 */
const MonthSelectorFactory = (spec) => {
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

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');


    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const DropDownMenu = require('material-ui/DropDownMenu').default;
    const MenuItem = require('material-ui/MenuItem').default;

    // Theme
    const IconMap = require('../../theme/IconMap');
    const mainTheme = require('../../theme/mainTheme').default;

    // Actions
    const {
        CalendarActionsFactory,
        EventActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default
    const esUtils = require('ES/utils/esUtils');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        updateSelectedMonthYear,
        updateSelectorYear
    } = CalendarActionsFactory({});

    const {
        stopProp
    } = EventActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generateMonths;
    let _monthChangeHandler;
    let _nextYearHandler;
    let _prevYearHandler;
    let _yearChangeHandler;

    /**
     *
     * @returns {Array}
     * @private
     */
    _generateMonths = () => {
        let rows = [];
        let monthCount = 1;
        let colCount = 0;

        _.map(_.range(4), (i) => {
            rows[i] = [];
            colCount = 0;
            while (colCount < 3) {
                rows[i].push({key: monthCount, value: esUtils.get_month_name(monthCount, true)});
                colCount += 1;
                monthCount += 1;
            }
        });

        return rows;
    };

    /**
     *
     * @param month
     * @param inst
     * @private
     */
    _monthChangeHandler = (month, inst) => {
        const {
            calendar,
            dispatch,
            onSelectorClose
        } = inst.props;

        const selectorYear = calendar.get('selectorYear');
        const selectedYear = calendar.get('selectedYear');

        dispatch(updateSelectedMonthYear({
            selectedMonth: month.key,
            selectedYear: selectorYear || selectedYear
        }));

        onSelectorClose();
    };

    /**
     *
     * @param inst
     * @private
     */
    _nextYearHandler = (inst) => {
        const {
            calendar,
            dispatch
        } = inst.props;

        const maxYear = DateTools.getSystemMaxDate().getFullYear();
        const selectorYear = calendar.get('selectorYear');
        const selectedYear = calendar.get('selectedYear');
        let nextYear = (selectorYear || selectedYear) + 1;

        if (nextYear > maxYear) {
            nextYear = maxYear;
        }

        if (nextYear !== selectorYear) {
            dispatch(updateSelectorYear({
                selectorYear: nextYear
            }));
        }
    };

    /**
     *
     * @param inst
     * @private
     */
    _prevYearHandler = (inst) => {
        const {
            calendar,
            dispatch
        } = inst.props;

        const minYear = DateTools.getSystemMinDate().getFullYear();
        const selectorYear = calendar.get('selectorYear');
        const selectedYear = calendar.get('selectedYear');
        let prevYear = (selectorYear || selectedYear) - 1;

        if (prevYear < minYear) {
            prevYear = minYear;
        }

        if (prevYear !== selectorYear) {
            dispatch(updateSelectorYear({
                selectorYear: prevYear
            }));
        }
    };

    /**
     *
     * @param value
     * @param inst
     * @private
     */
    _yearChangeHandler = (value, inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(updateSelectorYear({
            selectorYear: value
        }));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            onSelectorClose: PropTypes.func.isRequired
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
        displayName: 'MonthSelector',
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
                calendar
            } = this.props;

            const minDate = DateTools.getSystemMinDate();
            const maxDate = DateTools.getSystemMaxDate();
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();
            const minMonth = minDate.getMonth();
            const maxMonth = maxDate.getMonth();

            const selectedMonth = calendar.get('selectedMonth');
            const selectedYear = calendar.get('selectedYear');
            const selectorYear = calendar.get('selectorYear');
            const ddValue = selectorYear || selectedYear;

            const baseMonthStyle = {
                flexGrow: 1,
                flexShrink: 1,
                textAlign: 'center',
                margin: 'auto'
            };

            let appliedMonthStyle = _.assign({}, baseMonthStyle);

            return (
                <div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        justifyContent: 'center'
                    }}>

                        <div style={{
                            order: 1,
                            width: '56px',
                            flexGrow: 0,
                            flexShrink: 0,
                            paddingTop: '5px'
                        }}>
                            {IconMap.getButton('chevron-left', {
                                onClick: (e) => {
                                    stopProp(e);

                                    _prevYearHandler(this);
                                }
                            })}
                        </div>

                        <div style={{
                            order: 2,
                            flexGrow: 1,
                            flexShrink: 1,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            <DropDownMenu value={ddValue} onChange={(event, index, value) => {
                                _yearChangeHandler(value, this);
                            }}>
                                {_.map(_.range(minYear, maxYear + 1), (year) => {
                                    return <MenuItem key={`menu-${year}`} value={year} primaryText={year}/>;
                                })}
                            </DropDownMenu>
                        </div>

                        <div style={{
                            order: 3,
                            width: '56px',
                            flexGrow: 0,
                            flexShrink: 0,
                            paddingTop: '5px'
                        }}>
                            {IconMap.getButton('chevron-right', {
                                onClick: (e) => {
                                    stopProp(e);

                                    _nextYearHandler(this);
                                }
                            })}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>

                        {_.map(_generateMonths(), (row, i) => {
                            let orderCount = 0;

                            return <div key={`row-${i}`} style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {
                                    _.map(row, (month) => {
                                        let backgroundColor = mainTheme.appBackgroundColor;
                                        let color = mainTheme.fontColor;
                                        let disabled = false;

                                        orderCount += 1;

                                        appliedMonthStyle = _.assign(appliedMonthStyle, {
                                            order: orderCount
                                        });

                                        if ((ddValue >= maxYear && month.key > maxMonth) || (ddValue <= minYear && month.key < minMonth)) {
                                            color = 'rgba(0, 0, 0, 0.2)';
                                            disabled = true;
                                        }

                                        if (selectedYear === ddValue && month.key === selectedMonth) {
                                            backgroundColor = mainTheme.backgroundColor;
                                            color = mainTheme.foregroundColor;
                                        }

                                        return <div style={appliedMonthStyle}
                                                    key={`month-${month.key}`}
                                                    onClick={(e) => {
                                                        stopProp(e);

                                                        if (!disabled) {
                                                            _monthChangeHandler(month, this);
                                                        }
                                                    }}>
                                            <Avatar
                                                backgroundColor={backgroundColor}
                                                color={color}
                                                size={50}
                                                style={{
                                                    fontSize: '20px'
                                                }}>
                                                {month.value}
                                            </Avatar>
                                        </div>;
                                    })
                                }
                            </div>;
                        })}

                    </div>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MonthSelectorFactory }