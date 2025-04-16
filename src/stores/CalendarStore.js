/**
 * Creates an CalendarStore.  Handles all state changes to the calendar
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const CalendarStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const moment = require('moment');
    const {fromJS} = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Models
    const CalendarModel = require('./models/CalendarModel').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const _initialState = () => {
        return new CalendarModel({
            selectedYear: moment().year(),
            selectedMonth: moment().month() + 1
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _mergeCalendarData;
    let _nextMonth;
    let _prevMonth;
    let _selectDay;
    let _updatePeriod;
    let _updateStore;

    /**
     *
     * @param {CalendarModel} auth
     * @returns {CalendarModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|CalendarModel} calendar
     * @returns {CalendarModel}
     * @private
     */
    _mergeCalendarData = (payload, calendar) => {
        const selectedMonth = calendar.get('selectedMonth');
        const selectedYear = calendar.get('selectedYear');

        const calendarData = calendar.get('calendarData');

        return calendar.set('calendarData', calendarData.set(`${selectedYear}-${selectedMonth}`, fromJS(payload)));
    };

    /**
     *
     * @param {Record|CalendarModel} calendar
     * @returns {CalendarModel}
     * @private
     */
    _nextMonth = (calendar) => {
        const selectedMonth = calendar.get('selectedMonth');
        const selectedYear = calendar.get('selectedYear');

        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }

        return calendar.set('selectedMonth', newMonth).set('selectedYear', newYear);
    };

    /**
     *
     * @param {Record|CalendarModel} calendar
     * @returns {CalendarModel}
     * @private
     */
    _prevMonth = (calendar) => {
        const selectedMonth = calendar.get('selectedMonth');
        const selectedYear = calendar.get('selectedYear');

        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;

        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }

        return calendar.set('selectedMonth', newMonth).set('selectedYear', newYear);
    };

    /**
     *
     * @param {number} payload
     * @param {Record|CalendarModel} calendar
     * @returns {Record|CalendarModel}
     * @private
     */
    _selectDay = (payload, calendar) => {
        return calendar.set('selectedDay', payload);
    };

    /**
     *
     * @param {object} payload
     * @param {Record|CalendarModel} calendar
     * @returns {Record|CalendarModel}
     * @private
     */
    _updatePeriod = (payload, calendar) => {
        return calendar
            .set('selectedYear', payload.selectedYear)
            .set('selectedMonth', payload.selectedMonth);
    };

    /**
     *
     * @param {object} payload
     * @param {Record|CalendarModel} calendar
     * @returns {Record|CalendarModel}
     * @private
     */
    _updateStore = (payload, calendar) => {
        let updatedModel = calendar;

        if (_.has(payload, 'selectedYear')) {
            updatedModel = updatedModel.set('selectedYear', payload.selectedYear);
        }

        if (_.has(payload, 'selectedMonth')) {
            updatedModel = updatedModel.set('selectedMonth', payload.selectedMonth);
        }

        if (_.has(payload, 'selectorYear')) {
            updatedModel = updatedModel.set('selectorYear', payload.selectorYear);
        }

        if (_.has(payload, 'calendarData')) {
            updatedModel = updatedModel.set('calendarData', calendar.get('calendarData').merge(payload.calendarData));
        }

        return updatedModel;
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    /**
     * Handles all store based radio calls and determines an action to take
     * if any.
     *
     * @param {null|Record|CalendarModel} calendar
     * @param {object} action
     * @returns {Record|CalendarModel}
     */
    return (calendar, action) => {
        if (!calendar) {
            calendar = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.CALENDAR_STORE_UPDATE:
                return _updateStore(payload, calendar);
            case RADIOS.stores.CALENDAR_STORE_MERGE_CALENDAR_DATA:
                return _mergeCalendarData(payload, calendar);
            case RADIOS.stores.CALENDAR_STORE_NEXT_MONTH:
                return _nextMonth(calendar);
            case RADIOS.stores.CALENDAR_STORE_PREV_MONTH:
                return _prevMonth(calendar);
            case RADIOS.stores.CALENDAR_STORE_SELECT_DAY:
                return _selectDay(payload, calendar);
            case RADIOS.stores.CALENDAR_STORE_UPDATE_CALENDAR_PERIOD:
                return _updatePeriod(payload, calendar);
            case RADIOS.stores.CLEAR_SPEAKER_DATA:
            case RADIOS.stores.REFRESH_DATA:
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return calendar;
    };
}

export {
    CalendarStoreFactory
};