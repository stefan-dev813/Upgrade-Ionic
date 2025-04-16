/**
 * Generates a ContactsView component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const ContactsViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {AddButtonFactory} = require('../../components/AddButton');
    const {ContactListFactory} = require('../../components/list/ContactList');
    const {ContactsFormFactory} = require('../../forms/ContactsForm');
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {FormLoadingFactory} = require('../../components/FormLoading');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const DateToolsFactory = require('../../util/DateTools').default;
    const {
        log
    } = require('../../util/DevTools').default;
    const {
        isEspeakers
    } = require('../../util/Platform').default;

    // Actions
    const {
        ContactActionsFactory,
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        selectContact
    } = ContactActionsFactory({});
    const {
        prepareContactsFormData,
        saveEvent,
        stopProp
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Factories
     *********************************/

    const AddButton = AddButtonFactory({});
    const ContactList = ContactListFactory({});
    const ContactsForm = ContactsFormFactory({});
    const EventInfoCard = EventInfoCardFactory({});
    const FormLoading = FormLoadingFactory({});

    /**********************************
     * Methods
     *********************************/

    let _addContactHandler;
    let _submitHandler;
    let _toggleContactDetails;

    /**
     * @param inst
     * @private
     */
    _addContactHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectContact({
            id: '0'
        }));
    };

    /**
     * Handles ContactForm submission
     *
     * @param {object} form - Form values
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            event
        } = inst.props;
        const modifiedEvent = event.get('modifiedEvent');

        // merge in saved data
        const formData = prepareContactsFormData({
            form,
            inst
        });
        const mergedEvent = modifiedEvent.merge(formData);

        saveEvent(mergedEvent);
    };

    /**
     *
     * @param item
     * @param inst
     * @private
     */
    _toggleContactDetails = (item, inst) => {
        inst.setState({
            toggledContactId: item.dataset.contactId
        });
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let overrides = {};

    let component = createClass(_.assign({}, {

        /**
         * Used in debug messaging
         */
        displayName: 'ContactsView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, DateTools],

        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                expandAllContacts: false,
                toggledContactId: null
            };
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                expandAllContacts
            } = this.state;

            let actions = [];

            if (isEspeakers()) {
                actions.push({
                    label: getText('Add Contacts'),
                    iconClass: 'person-add',
                    onClick: (e) => {
                        stopProp(e);

                        _addContactHandler(this);
                    }
                });
            }

            return (
                <div>
                    <EventInfoCard/>

                    <ContactList/>

                    <FormLoading>
                        <ContactsForm
                            ref='contactForm'
                            onSubmit={(form) => {
                                _submitHandler(form, this);
                            }}/>

                        <AddButton actions={actions}/>
                    </FormLoading>
                </div>
            );
        }
    }, overrides));

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContactsViewFactory }