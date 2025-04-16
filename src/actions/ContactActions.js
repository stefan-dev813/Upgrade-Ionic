/**
 * Generates the Contact Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const ContactActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Actions
    const EventActionsFactory = require('./EventActions').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {extractSelectedItem} = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _deleteContact;
    let _extractSelectedContact;
    let _saveContact;
    let _selectContact;

    /**
     *
     * @param data
     * @private
     */
    _deleteContact = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_DELETE_CONTACT,
            payload: data
        };
    };

    /**
     *
     * @param event
     * @returns {Record|null}
     * @private
     */
    _extractSelectedContact = (event) => {
        return extractSelectedItem(event, 'selectedContact', 'EventContact', 'id', {groupcodes: []});
    };

    /**
     * Adds or Saves a note to the existing collection, unpersisted with server
     *
     * @param data
     * @private
     */
    _saveContact = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_CONTACT,
            payload: data
        };
    };

    /**
     * Updates the store with the selected Contact object and navigates to the subview
     *
     * @param {object} data
     * @private
     */
    _selectContact = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_CONTACT,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.CONTACT_VIEW
            }
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        deleteContact: _deleteContact,
        extractSelectedContact: _extractSelectedContact,
        saveContact: _saveContact,
        selectContact: _selectContact
    };
}

export default ContactActionsFactory;