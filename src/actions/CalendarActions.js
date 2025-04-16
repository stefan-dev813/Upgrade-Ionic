/**
 * Generates the Calendar Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const CalendarActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _extractMonthData;
    let _loadCalendarData;
    let _mergeCalendarData;
    let _nextMonth;
    let _prevMonth;
    let _selectDay;
    let _updateCalendarPeriod;
    let _updateSelectedMonthYear;
    let _updateSelectorYear;

    /**
     *
     * @param calendar
     * @returns {*}
     * @private
     */
    _extractMonthData = (calendar) => {
        const selectedMonth = calendar.get('selectedMonth');
        const selectedYear = calendar.get('selectedYear');
        const calendarData = calendar.get('calendarData');
        const monthData = calendarData.get(`${selectedYear}-${selectedMonth}`);

        if (!monthData) {
            return null;
        }

        const monthCalendar = monthData.get('calendar');
        let year;
        let month;
        let data = {};

        if (monthCalendar) {
            year = monthCalendar.get(selectedYear.toString());
        }

        if (year) {
            month = year.get(selectedMonth.toString());
        }

        if (month) {
            data = month.toJS();
        }

        return {
            data,
            details: monthData.get('details').toJS()
        };
    };

    /**
     * Handles the loadCalendarData action
     *
     * @param selectedSpeaker
     * @param selectedYear
     * @param selectedMonth
     * @private
     */
    _loadCalendarData = (selectedSpeaker, selectedYear, selectedMonth) => {
        radio(RADIOS.services.LOAD_CALENDAR).broadcast({
            sids: [selectedSpeaker.get('sid')],
            year: selectedYear,
            month: selectedMonth
        });
    };

    /**
     * Handles the mergeCalendarData actions
     *
     * @param payload
     * @private
     */
    _mergeCalendarData = (payload) => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_MERGE_CALENDAR_DATA,
            payload
        };
    };

    /**
     * Sets the calendar's selected month/year to the next month
     *
     * @returns {object}
     * @private
     */
    _nextMonth = () => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_NEXT_MONTH
        };
    };

    /**
     * Sets the claendar's selected month/year to the previous month
     *
     * @returns {object}
     * @private
     */
    _prevMonth = () => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_PREV_MONTH
        };
    };

    /**
     *
     * @param payload
     * @private
     */
    _selectDay = (payload) => {
        return [
            {
                type: RADIOS.stores.CALENDAR_STORE_SELECT_DAY,
                payload
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.CALENDAR_EVENTS_VIEW
            }
        ];
    };

    /**
     * Handles the updateCalendarPeriod action
     *
     * @param payload
     * @private
     */
    _updateCalendarPeriod = (payload) => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_UPDATE_CALENDAR_PERIOD,
            payload
        };
    };

    /**
     *
     * @param payload
     * @returns {{type: string, payload}}
     * @private
     */
    _updateSelectedMonthYear = (payload) => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_UPDATE,
            payload: _.pick(payload, ['selectedMonth', 'selectedYear'])
        };
    };

    /**
     *
     * @param payload
     * @returns {{type: string, payload: *}}
     * @private
     */
    _updateSelectorYear = (payload) => {
        return {
            type: RADIOS.stores.CALENDAR_STORE_UPDATE,
            payload
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        extractMonthData: _extractMonthData,
        loadCalendarData: _loadCalendarData,
        mergeCalendarData: _mergeCalendarData,
        nextMonth: _nextMonth,
        prevMonth: _prevMonth,
        selectDay: _selectDay,
        updateCalendarPeriod: _updateCalendarPeriod,
        updateSelectedMonthYear: _updateSelectedMonthYear,
        updateSelectorYear: _updateSelectorYear
    };
}

export default CalendarActionsFactory;