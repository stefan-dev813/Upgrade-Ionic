/**
 * Creates an ContactForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AddressMixin
 */
const ContactFormFactory = (spec) => {
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
    const moment = require('moment');
    const {
        connect
    } = require('react-redux');

    // Enums
    const BTN = require('../enums/BTN').default;

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory,
        SubViewMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Forms
    const {
        PanelFactory
    } = require('../components');

    // Actions
    const {
        ContactActionsFactory,
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../util/DevTools').default;
    const DateTools = require('../util/DateTools').default({});


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
        deleteContact
    } = ContactActionsFactory({});
    const {
        showDeleteConfirmation
    } = DialogActionsFactory({});
    const {
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _actionDeleteContact;
    let _buildContactSchema;
    let _updateHeaderActions;

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteContact = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    dispatch,
                    event
                } = inst.props;
                const selectedContact = event.get('selectedContact');

                dispatch(toggleEventDirty(true));
                dispatch(deleteContact({
                    id: selectedContact.get('id')
                }));
                dispatch(toggleViewDirty(false));
                dispatch(popSubView());
            },
            text: getText('Are you sure you want to delete this %1$s?', {
                params: [getText('Contact')]
            })
        }));
    };

    /**
     *
     * @param inst
     * @returns {object}
     * @private
     */
    _buildContactSchema = (inst) => {
        const {
            state
        } = inst;

        const {
            email,
            phone,
            mobile
        } = state.data;

        return {
            cname: {
                name: 'cname',
                label: getText('Name'),
                type: 'text',
                iconClass: 'fa-user'
            },
            company: {
                name: 'company',
                label: getText('Company'),
                type: 'text',
                iconClass: 'fa-building'
            },
            title: {
                name: 'title',
                label: getText('Title'),
                type: 'text',
                iconClass: 'fa-tag'
            },
            'phone': {
                name: 'phone',
                label: getText('Phone'),
                type: 'phone',
                iconClass: 'phone',
                iconTel: phone
            },
            'mobile': {
                name: 'mobile',
                label: getText('Mobile'),
                type: 'phone',
                iconClass: 'smartphone',
                iconTel: mobile
            },
            fax: {
                name: 'fax',
                label: getText('Fax'),
                type: 'fax',
                iconClass: 'fa-fax'
            },
            'email': {
                name: 'email',
                label: getText('Email'),
                type: 'email',
                iconClass: 'email',
                iconMailTo: email
            },
            contnotes: {
                name: 'contnotes',
                label: getText('Notes'),
                type: 'textarea',
                iconClass: 'fa-pencil-square'
            },
            groupcodes: {
                name: 'groupcodes',
                label: getText('Group Code'),
                placeholder: getText('Group Code'),
                type: 'select',
                options: inst.generateGroupCodeOptions('contactcodes'),
                iconClass: 'fa-group'
            }
        };
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _updateHeaderActions = (inst, props) => {
        let currentProps = props || inst.props;

        const {
            dispatch,
            event
        } = currentProps;

        const selectedContact = event.get('selectedContact');

        let actions = inst.determineSaveAction(currentProps);

        if (selectedContact.get('id') && DateTools.parseNum(selectedContact.get('id')) !== 0) {
            actions.push({
                type: BTN.DELETE,
                onClick: (event) => {
                    stopProp(event);

                    _actionDeleteContact(inst);
                }
            });
        }

        dispatch(setHeaderActions(actions));
    };

    /**********************************
     * Components
     *********************************/

    const Panel = PanelFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AddressMixin = AddressMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'nav',
            'event',
            'displayData'
        ]
    });

    const SubViewMixin = SubViewMixinFactory({});

    const ViewMixin = ViewMixinFactory({
        overrides: {
            updateHeaderActions(props) {
                // This is called inside ViewMixin, so 'this' references the react component
                _updateHeaderActions(this, props);
            }
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
        displayName: 'ContactForm',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin, AddressMixin, ViewMixin, SubViewMixin],
        /**
         * Generates the full schema to build the form inputs
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            const {
                event
            } = this.props;
            const {
                data
            } = this.state;

            const modifiedEvent = event.get('modifiedEvent');

            return _.assign({}, _buildContactSchema(this), this.buildAddressSchema(data));
        },

        getInitialValues() {
            const {
                event
            } = this.props;

            const selectedContact = event.get('selectedContact');
            const modifiedEvent = event.get('modifiedEvent');
            const contact = extractSelectedContact(event, selectedContact.get('id'));

            let initialValues = _.assign(_.pick(contact.toJS(), [
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
                groupcodes: contact.get('groupcodes').first(),
                country: contact.get('country') || 'US'
            });

            _.map(initialValues, (value, key) => {
                if (_.isBoolean(value) && value === false) {
                    initialValues[key] = '';
                }
            });

            return initialValues;
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            dispatch(toggleViewDirty(this.Form_areChangesMade()));
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event
            } = this.props;

            const selectedContact = event.get('selectedContact');

            let mode = this.determineMode(selectedContact.get('id'));

            return (
                <form
                    ref='contact-form'
                    onSubmit={this.Form_onSubmit}>
                    <Panel headingText={getText('%1$s Contact', {params: [mode]})}
                           headingIconClass='fa-book'>
                        {this.generateFields({
                            fields: _buildContactSchema(this)
                        })}
                    </Panel>
                    <Panel headingText={getText('Address')}
                           headingIconClass='fa-map-marker'>
                        {this.generateFields({fields: this.buildAddressSchema(this.state.data)})}
                    </Panel>
                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContactFormFactory }
