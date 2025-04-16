/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Immutable = require('immutable');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const MessageModel = require('../stores/models/MessageModel').default;

// Actions
const {TranslateActionsFactory} = require('../actions');

/**
 * Creates an MessageStore.  Handles all state changes to the messages
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const MessageStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    /**
     *
     * @returns {List<MessageModel>|List<any>}
     * @private
     */
    const _initialState = () => {
        return Immutable.List();
    };

    /**********************************
     * Methods
     *********************************/

    let _addMessage;
    let _clearMessages;
    let _logout;

    /**
     * Adds a MessageModel to the state
     *
     * @param {Record|MessageModel} payload
     * @param {List<MessageModel>|List<any>} messages
     * @returns {List<MessageModel>|List<any>}
     * @private
     * @see MessageModel
     * @see List
     */
    _addMessage = (payload, messages) => {
        return messages.push(new MessageModel(payload));
    };

    /**
     * Clears all messages off the state
     *
     * @param {List<MessageModel>|List<any>} messages
     * @returns {List<MessageModel>|List<any>}
     * @private
     * @see MessageModel
     * @see List
     */
    _clearMessages = (messages) => {
        return messages.clear();
    };

    /**
     *
     * @param {List<MessageModel>|List<any>} messages
     * @returns {List<MessageModel>|List<any>}
     * @private
     * @see MessageModel
     * @see List
     */
    _logout = (messages) => {
        return _addMessage({type: 'success', text: getText('You Have Been Logged Out')}, messages);
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
     * @param {null|List<MessageModel>|List<any>} messages
     * @param {object} action
     *
     * @returns {List<MessageModel>|List<any>}
     */
    return (messages, action) => {
        if (!messages) {
            messages = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.MESSAGE_STORE_ADD:
                return _addMessage(payload, messages);
            case RADIOS.stores.MESSAGE_STORE_CLEAR:
                return _clearMessages(messages);
            case RADIOS.stores.LOGOUT:
                return _logout(messages);
        }

        return messages;
    };
}

export {
    MessageStoreFactory
};