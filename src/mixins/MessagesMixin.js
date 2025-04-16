/**
 * Provides methods to help build out Message Components
 * @mixin
 */
const MessagesMixin = {
    /**
     * Determines what Icon to display with message.
     *
     * @param {object} message
     * @returns {*}
     */
    determineIcon(message) {
        switch (message.get('type')) {
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            case 'success':
                return 'thumb-up';
        }
    }
};

export default MessagesMixin;