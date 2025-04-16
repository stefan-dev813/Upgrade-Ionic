/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');

// Utilities
const {log} = require('../util/DevTools').default;

/**
 * Interacts with the HTML5 Local Storage feature
 *
 * @params {object} spec - Collection of all parameters
 */
const LocalStorageServiceFactory = (spec) => {

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    let _localStorage = undefined;
    let _hasLocalStorage;

    /**
     * Determines if your current runtime environment suppors HTML5 localStorage
     *
     * @private
     *
     * @return {boolean}
     */
    _hasLocalStorage = () => {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };

    if (_hasLocalStorage()) {
        _localStorage = window.localStorage;
    }

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        /**
         * Returns an item from localStorage
         *
         * @param {string} key
         * @param {function} parser - A method or means of parsing what was stored.  For example a stringified JSON object.
         *
         * @return {*}
         */
        fetchItem(key, parser) {
            if (!_localStorage) return null;

            let retval = _localStorage.getItem(key);

            if (parser && typeof parser === 'function') {
                retval = parser(retval);
            }

            return retval;
        },
        /**
         * Fetches multiple items from _localStorage
         *
         * @param {string[]} items
         *
         * @return {object} - Key/value pair object of fetched items
         */
        fetchItems(items /* array of keys */) {
            if (!_localStorage) return null;

            let fetchedItems = {};

            _.each(items, (key) => {
                fetchedItems[key] = this.fetchItem(key);
            });

            return fetchedItems;
        },
        /**
         * Saves an item into localStorage.  If it's an object, then it stringifies it first.
         *
         * @param {string} key
         * @param {*} data
         */
        storeItem(key, data) {
            if (!_localStorage) return null;

            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            _localStorage.setItem(key, data);
        },
        /**
         * Saves a collection of items into localStorage
         *
         * @param {object[]} items
         * @property {object} item
         * @property {string} item.key
         * @property {*} item.data
         */
        storeItems(items /* array of key/value pairs */) {
            if (!_localStorage) return null;

            _.map(items, (data, key) => {
                this.storeItem(key, data);
            });
        },
        /**
         * Deletes an item from localStorage
         *
         * @param {string} key
         */
        removeItem(key) {
            if (!_localStorage) return null;

            _localStorage.removeItem(key);
        },
        /**
         * Deletes multiple items from localStorage
         *
         * @param {string[]} items
         */
        removeItems(items /* array of keys */) {
            if (!_localStorage) return null;

            _.each(items, (key) => {
                this.removeItem(key);
            });
        },
        /**
         * Clears out localStorage entirely
         *
         */
        clear() {
            if (!_localStorage) return null;

            _localStorage.clear();
        }
    };
};

export default LocalStorageServiceFactory;