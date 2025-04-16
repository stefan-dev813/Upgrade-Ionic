/**
 * Generates a DateTools Utility class
 *
 * @param {object} spec - Container for named parameters
 * @returns {object}
 */
const DateToolsFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const moment = require('moment');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Constants
     *********************************/

    const DATE_STRING = 'MM/DD/YYYY';
    const TIME_STRING = 'hh:mm A';

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        /**
         * Date formatting masks
         *
         * TODO: Merge in esUtils masks
         */
        masks: {
            DATE_STRING,
            TIME_STRING,
            DATE_TIME_STRING: `${DATE_STRING} ${TIME_STRING}`
        },
        /**
         * Takes a Balboa timestamp and converts it to a Date object
         *
         * @param {number|Date} stamp
         * @returns {Date}
         */
        convertFromBalboaTrunkTimestamp(stamp) {
            let date = stamp;

            if (_.isNumber(stamp)) {
                date = new Date(stamp * 1000);
            }
            else if (_.isString(stamp)) {
                date = new Date(stamp);
            }

            if (date && date.getFullYear() === 1950) {
                return null;
            }

            return date;
        },
        /**
         * Takes a date and modifies it to work with Balboa
         *
         * @param {Date} date
         * @returns {number}
         */
        convertToBalboaTrunkTimestamp(date) {
            if (_.isString(date)) {
                date = this.toDate(date);
            }

            if (!_.isDate(date)) {
                console.warn("convertToBalboaTrunkTimestamp: Valid date not provided");
                return null;
            }

            return date.getTime() / 1000;
        },
        convertFromBalboaToDate(stamp) {
            let date = null;

            if (_.isDate(stamp)) {
                date = stamp;
            } else if (_.isNumber(stamp) && stamp > 0) {
                date = this.convertFromBalboaTrunkTimestamp(stamp);
            }

            return date;
        },
        convertFromBalboaToDateString(stamp) {
            let date = stamp;

            if (_.isNumber(stamp)) {
                date = this.convertFromBalboaTrunkTimestamp(stamp);
            }

            if (!date) {
                return null;
            }

            return moment(date).format(this.masks.DATE_STRING);
        },
        convertFromBalboaToTime(stamp) {
            let date = this.convertFromBalboaToDate(stamp);

            // We have to just assume 0 means they didn't enter anything.  It's not perfect, but we have no other
            // way to tell they entered no time aspect
            if (date.getHours() === 0) {
                return null;
            }

            return date;
        },
        convertFromBalboaToTimeString(stamp) {
            let date = stamp;

            if (_.isNumber(stamp)) {
                date = this.convertFromBalboaTrunkTimestamp(stamp);
            }

            if (!date) {
                return null;
            }

            return moment(date).format(this.masks.TIME_STRING);
        },
        /**
         * Parses a date and time string into a Moment object
         *
         * @param {string} dateStr
         * @param {string} timeStr
         * @returns {Moment|null}
         */
        toMoment(dateStr, timeStr) {
            let dateTimeStr;
            let retMoment = null;

            if (_.isDate(dateStr)) {
                dateStr = moment(dateStr).format(this.masks.DATE_STRING);
            }

            if (!dateStr || dateStr.length <= 1) {
                return null;
            }

            if (_.isDate(timeStr)) {
                timeStr = moment(timeStr).format(this.masks.TIME_STRING);
            }

            dateTimeStr = dateStr;

            if (timeStr && timeStr.length > 1) {
                dateTimeStr += ` ${timeStr}`;

                retMoment = moment(dateTimeStr, this.masks.DATE_TIME_STRING);
                if (retMoment.isValid()) {
                    return retMoment;
                }
            }
            else {
                retMoment = moment(dateTimeStr, this.masks.DATE_STRING);
                if (retMoment.isValid()) {
                    return retMoment;
                }
            }

            return null;
        },
        /**
         * Combines two date objects; one focused on the day and one focused on the time
         * @param dateObj
         * @param timeObj
         * @returns {null|Date}
         */
        mergeDate(dateObj, timeObj) {
            let dateStr;
            let timeStr;
            let dateTimeObj = dateObj;

            if (!_.isDate(dateObj)) {
                return null;
            }

            if (!_.isDate(timeObj)) {
                return dateTimeObj;
            }

            dateStr = moment(dateObj).format(this.masks.DATE_STRING);
            timeStr = moment(timeObj).format(this.masks.TIME_STRING);

            return this.toDate(dateStr, timeStr);
        },
        /**
         * Parses a date and time string and returns a Date
         *
         * @param {string} dateStr
         * @param {string} timeStr
         * @returns {Date|null}
         */
        toDate(dateStr, timeStr) {
            let momentObj = this.toMoment(dateStr, timeStr);

            if (momentObj && momentObj.isValid()) {
                return momentObj.toDate();
            }

            return null;
        },
        /**
         * Determines a minimum date for date pickers.
         *
         * @returns {Date}
         */
        getSystemMinDate() {
            let currentMoment = moment();
            currentMoment.subtract(2, 'years');

            return currentMoment.toDate();
        },
        /**
         * Determines a maximum date for date pickers.
         *
         * @returns {Date}
         */
        getSystemMaxDate() {
            let currentMoment = moment();
            currentMoment.add(5, 'years');
            // set a maximum on years
            return currentMoment.toDate();
        },
        /**
         * Determines a maximum start date based on a set stop date or the system max date
         *
         * @param {object} spec
         * @property {string} spec.stopDate
         * @returns {Date}
         */
        getMaxStartDate(spec) {
            const {
                stopDate
            } = spec;

            if (stopDate && stopDate.length > 1) {
                let retMoment = this.toMoment(stopDate);

                if (retMoment && retMoment.isValid()) {
                    return retMoment.toDate();
                }
            }

            return this.getSystemMaxDate();
        },
        /**
         * Determines a minimum stop date based on start date
         *
         * @param {object} spec
         * @property {string} spec.startDate
         * @returns {Date}
         */
        getMinStopDate(spec) {
            const {
                startDate
            } = spec;

            let startMoment = this.toMoment(startDate);

            if (startMoment && startMoment.isValid()) {
                return startMoment.toDate();
            }

            return this.getSystemMinDate();
        },
        /**
         * Determines a minimum stop time based on a start time
         *
         * @param {object} spec - Container for named parameters
         * @property {string} spec.startDate
         * @property {string} spec.startTime
         * @property {string} spec.stopDate
         * @property {string} spec.stopTime
         * @returns {Date|null}
         */
        getMinStopTime(spec) {
            const {
                startDate,
                startTime,
                stopDate,
                stopTime
            } = spec;

            let startMoment = this.toMoment(startDate);
            let stopMoment = this.toMoment(stopDate);
            let dayDiff = 0;
            let minMoment = moment();

            if (!startMoment || !stopMoment) {
                return null;
            }

            dayDiff = this.toMoment(startDate).diff(this.toMoment(stopDate), 'days');

            if (dayDiff === 0 && startTime && startTime.length > 1) {
                return this.toDate(startDate, startTime);
            }

            return null;
        },

        isBalboaDate(date) {
            return ((_.isNumber(date) && date > 0) || _.isDate(date));
        },

        /**
         *
         * @param {*|string|null} value
         * @returns {number}
         * @private
         */
        parseNum (value) {
            try {
                if (!value)
                    return 0;

                return parseInt(value, 10);
            } catch (e) {
                return 0;
            }
        }
    };
}

export default DateToolsFactory;