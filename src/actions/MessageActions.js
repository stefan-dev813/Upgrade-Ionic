/**
 * Generates the Message actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const MessageActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _addMessage;
    let _clearMessages;
    let _setMessage;

    /**
     * Handles the addMessage action
     *
     * @param msg
     * @private
     */
    _addMessage = (msg) => {
        return {
            type: RADIOS.stores.MESSAGE_STORE_ADD,
            payload: msg
        };
    };

    /**
     * Handles the clearMessages action
     *
     * @private
     */
    _clearMessages = () => {
        return {
            type: RADIOS.stores.MESSAGE_STORE_CLEAR
        };
    };

    /**
     * Makes sure this is the only message on the stack.
     *
     * @param msg
     * @private
     */
    _setMessage = (msg) => {
        return [
            _clearMessages(),
            _addMessage(msg)
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        addMessage: _addMessage,
        clearMessages: _clearMessages,
        setMessage: _setMessage
    };
}

export default MessageActionsFactory;