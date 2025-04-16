/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const Immutable = require('immutable');
const {fromJS} = Immutable;

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an ContactStore.  Handles all state changes to the contacts
 * area of the state
 *
 * @param {object} spec
 * @property {function} spec.deleteListItem
 * @property {function} spec.updateList
 * @returns {object}
 * @constructor
 */
const ContactStoreFactory = (spec) => {
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

    let _deleteContact;
    let _saveContact;
    let _selectContact;

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _deleteContact = (payload, event) => {
        return deleteListItem(payload, event, 'EventContact');
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _saveContact = (payload, event) => {
        return updateList(payload, event, 'EventContact');
    };

    /**
     *
     * @param payload
     * @param event
     * @returns {*}
     * @private
     */
    _selectContact = (payload, event) => {
        const selectedContact = fromJS(payload);

        return event.set('selectedContact', selectedContact);
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
     * @returns {Record|EventModel}
     */
    return (event, action) => {
        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.EVENT_STORE_DELETE_CONTACT:
                return _deleteContact(payload, event);
            case RADIOS.stores.EVENT_STORE_SAVE_CONTACT:
                return _saveContact(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_CONTACT:
                return _selectContact(payload, event);
        }

        return event;
    };
}

export {
    ContactStoreFactory
};