/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Immutable = require('immutable');
const {fromJS} = Immutable;

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an TodoStore.  Handles all state changes to the todo's
 * area of the state
 *
 * @param {object} spec
 * @property {function} spec.deleteListItem
 * @property {function} spec.updateList
 * @returns {object}
 * @constructor
 */
const TodoStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {deleteListItem, updateList} = spec;

    /**********************************
     * Variables
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _deleteTodo;
    let _saveTodo;
    let _selectTodo;

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _deleteTodo = (payload, event) => {
        return deleteListItem(payload, event, 'EventTodo');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _saveTodo = (payload, event) => {
        return updateList(payload, event, 'EventTodo');
    };

    /**
     *
     * @param payload
     * @param event
     * @returns {*}
     * @private
     */
    _selectTodo = (payload, event) => {
        const selectedTodo = fromJS(payload);

        return event.set('selectedTodo', selectedTodo);
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
     * @param {Record|EventModel} event
     * @param {object} action
     *
     * @returns {Record|EventModel}
     */
    return (event, action) => {
        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.EVENT_STORE_DELETE_TODO:
                return _deleteTodo(payload, event);
            case RADIOS.stores.EVENT_STORE_SAVE_TODO:
                return _saveTodo(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_TODO:
                return _selectTodo(payload, event);
        }

        return event;
    };
}

export {
    TodoStoreFactory
};