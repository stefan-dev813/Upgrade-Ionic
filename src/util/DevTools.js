//-----------------------------------------------------------------------------
//
// Imports
//
//-----------------------------------------------------------------------------

const _ = require('lodash');
const {Iterable} = require('immutable');
// const config = require('../config');

//-----------------------------------------------------------------------------
//
// Private Members
//
//-----------------------------------------------------------------------------

//-------------------------------------
// Methods
//-------------------------------------

/**
 * Converts the passed in item to an object that can be handled by console
 *
 * @param {Object|Iterable} obj
 * @returns {Object}
 * @private
 */
const _toPrintable = (obj) => {
    if (Iterable.isIterable(obj) || _.isFunction(obj.toJS)) {
        return obj.toJS();
    }

    return obj;
};

/**
 *
 * @param obj
 * @private
 */
const _log = (obj) => {
    if (process.env.REACT_APP_LOGGING) {
        console.log(_toPrintable(obj));
    }
};

/**
 *
 * @param obj
 * @private
 */
const _warn = (obj) => {
    if (process.env.REACT_APP_LOGGING) {
        console.warn(_toPrintable(obj));
    }
};

//-----------------------------------------------------------------------------
//
// Public Interface
//
//-----------------------------------------------------------------------------

export default {
    log: _log,
    warn: _warn
};
