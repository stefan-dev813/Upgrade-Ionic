/**
 * Generates a ActivityList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MessageListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {MessageCardFactory} = require('../cards');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

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
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            messages: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'MessageList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {messages} = this.props;

            return <List>
                {messages ? messages.map((message, i) => {
                    return <div key={`message-${i}`}>
                        <MessageCard
                            message={message}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MessageListFactory }