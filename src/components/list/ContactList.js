/**
 * Generates a ContactList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ContactListFactory = (spec) => {
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

    const MessageModel = require('../../stores/models/MessageModel').default;

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {MessageCardFactory, ContactCardFactory} = require('../cards');
    const {ViewHeaderFactory} = require('../ViewHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    const {
        isEspeakers
    } = require('../../util/Platform').default;

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
     * Methods
     *********************************/

    let _determineText;

    /**
     *
     * @returns {*}
     * @private
     */
    _determineText = () => {
        if(isEspeakers()) {
            return getText('Tap the Add button below to create a new %1$s.', {
                params: [getText('Contact')]
            });
        }

        return getText('You do not currently have any Contacts.');
    };

    /**********************************
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});
    const ContactCard = ContactCardFactory({});
    const ViewHeader = ViewHeaderFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
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
        displayName: 'ContactList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getInitialState() {
            return {};
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {event} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            const contactList = modifiedEvent.get('EventContact');

            return <List>
                <ViewHeader>{getText('Contacts')}</ViewHeader>

                {contactList && contactList.size === 0 ?
                    <MessageCard message={new MessageModel({
                        type: 'info',
                        text: _determineText()
                    })}/>
                    : null}

                {contactList ? contactList.map((item, i) => {
                    return <div key={`contact-${i}`}>
                        <ContactCard
                            contact={item}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContactListFactory }