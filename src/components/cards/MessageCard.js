/**
 * Creates an MessageCard React Component
 *
 * @constructor
 * @param {spec} - Collection of named parameters
 * @return {function} - React Component
 * @mixes MessagesMixin
 * @mixes AutoShouldUpdateMixin
 */
const MessageCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        MessagesMixin
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _generateAvatar;

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {
            message
        } = inst.props;

        return <Avatar icon={IconMap.getElement(inst.determineIcon(message))}/>;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            message: PropTypes.object.isRequired
        }
    });

    /******************************************************************************
     *
     * React / Public Interface
     *
     *****************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'MessageCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, MessagesMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {JSX|XML}
         */
        render() {
            const {
                message
            } = this.props;

            return <ListItem
                leftAvatar={_generateAvatar(this)}
                primaryText={message.get('text')}/>;
        }
    });
}

export { MessageCardFactory }