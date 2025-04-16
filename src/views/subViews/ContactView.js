/**
 * Creates an ContactView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const ContactViewFactory = (spec) => {

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

    // Forms
    const {
        ContactFormFactory
    } = require('../../forms');

    const {FormLoadingFactory} = require('../../components/FormLoading');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        ContactActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        extractSelectedContact,
        saveContact
    } = ContactActionsFactory({});
    const {
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        toggleViewDirty
    } = ViewActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     *
     * @param form
     * @param inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');

        const selectedContact = extractSelectedContact(event);

        dispatch(saveContact(_.assign({
                id: '0'
            },
            (selectedContact ? selectedContact.toJS() : {}),
            _.pick(form, [
                'cname',
                'title',
                'company',
                'phone',
                'email',
                'contnotes',
                'fax',
                'mobile',
                'address',
                'city',
                'st',
                'country',
                'zip'
            ]), {
                groupcodes: [form.groupcodes]
            })));

        dispatch(toggleEventDirty(true));

        dispatch(toggleViewDirty(false));

        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const ContactForm = ContactFormFactory({});
    const FormLoading = FormLoadingFactory({});

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
         * Used in debug messages
         */
        displayName: 'ContactView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return (
                <FormLoading>
                    <ContactForm
                        ref='editContactForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }
                    />
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContactViewFactory }