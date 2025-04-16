const {TranslateActionsFactory} = require('../actions');

const {getText} = TranslateActionsFactory({});

const _ = require('lodash');

/**
 * Provides methods to help validate React Forms
 * @mixin
 */
const ValidationMixin = {
    /**
     * Verifies a valid phone formatting
     *
     * @param {string} value
     *
     * @return {boolean}
     */
    phonePlus(value) {
        if (/^([(,),\ \.\-,\+,0-9]+)$/.test(value) === false) {
            return getText('Please enter a valid phone number');
        }

        return true;
    },
    /**
     * Verifies a valid formatted time
     *
     * @param {string} value
     *
     * @return {boolean}
     */
    time(value) {
        if (/^([0-9]{0,2}\:[0-9]{0,2}[\ ]?(AM|PM))$/.test(value) === false) {
            return getText('Please enter a valid time');
        }

        return true;
    },
    /**
     * If a condition is met, then it will run a validator
     *
     * @param {boolean|function} condition
     * @param {function} validator
     * @returns {Function}
     */
    validateIf(condition, validator) {
        let shouldValidate = false;

        if (typeof condition === 'function') {
            shouldValidate = condition.call();
        } else if (typeof  condition === 'boolean') {
            shouldValidate = condition;
        }

        if (shouldValidate && typeof validator === 'function') {
            return (value) => {
                return validator(value);
            };
        }
    },
    /**
     * Similar to blankOr but supports more than just strings
     * @param {function} validator
     * @returns {function(*=)}
     */
    emptyOr(validator) {
        return (value) => {
            if (value === undefined || value === null) {
                return true;
            }

            if (_.isString(value)) {
                return this.blankOr(value, validator);
            } else if (_.isDate(value)) {
                return validator(value);
            }
        };
    }
};

export default ValidationMixin;