/**
 * Creates an ServiceForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const ServiceFormFactory = (spec) => {
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
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory,
        SubViewMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Components
    const {
        LinkCollapseAreaFactory,
        PanelFactory
    } = require('../components');

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        ServiceActionsFactory,
        SpeakerInfoActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../util/DevTools').default;
    const DateToolsFactory = require('../util/DateTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

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
        extractSelectedService,
        deleteService
    } = ServiceActionsFactory({});
    const {
        extractSpeakerService
    } = SpeakerInfoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _actionDeleteService;
    let _buildServiceSchema;
    let _updateHeaderActions;

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteService = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    dispatch,
                    event
                } = inst.props;
                const selectedService = event.get('selectedService');

                dispatch(toggleEventDirty(true));
                dispatch(deleteService({
                    id: selectedService.get('id')
                }));
                dispatch(toggleViewDirty(false));
                dispatch(popSubView());
            },
            text: getText('Are you sure you want to delete this %1$s?', {
                params: [getText('Service')]
            })
        }));
    };

    /**
     *
     * @param inst
     * @returns {object}
     * @private
     */
    _buildServiceSchema = (inst) => {
        const {
            data
        } = inst.state;

        return {
            groupcode: {
                name: 'groupcode',
                label: getText('Code'),
                type: 'select',
                options: inst.generateGroupCodeOptions('servicecodes'),
                iconClass: 'fa-group'
            },
            due: {
                name: 'due',
                label: getText('Due Date'),
                type: 'date',
                iconClass: 'fa-calendar',
                minDate: inst.getSystemMinDate(),
                maxDate: inst.getSystemMaxDate()
            },
            description: {
                name: 'description',
                label: getText('Description'),
                type: 'text',
                iconClass: 'fa-pencil-square'
            },
            amount: {
                name: 'amount',
                label: getText('Amount'),
                type: 'number',
                iconClass: 'attach-money',
                validate: v.validateIf((data.amountType === 'specified'), v.currency),
                disabled: (data.amountType !== 'specified')
            },
            amountType: {
                name: 'amountType',
                type: 'radioGroup',
                options: [{
                    label: getText('Specified'),
                    description: getText('Use the amount specified above.'),
                    value: 'specified'
                }, {
                    label: getText('Free'),
                    description: getText('You can choose Free to indicate there is no charge for this item'),
                    value: 'free'
                }, {
                    label: getText('Actual'),
                    description: getText('You can choose Actual Cost to indicate you will provide the amount later'),
                    value: 'bill_later'
                }]
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

        const selectedService = event.get('selectedService');

        let actions = inst.determineSaveAction(currentProps);

        if (selectedService.get('id') && DateTools.parseNum(selectedService.get('id')) !== 0) {
            actions.push({
                type: BTN.DELETE,
                onClick: (event) => {
                    stopProp(event);

                    _actionDeleteService(inst);
                }
            });
        }

        dispatch(setHeaderActions(actions));
    };

    /**********************************
     * Components
     *********************************/

    const LinkCollapseArea = LinkCollapseAreaFactory({});
    const Panel = PanelFactory({});

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'nav',
            'event',
            'speakerInfo'
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
        displayName: 'ServiceForm',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin, ViewMixin, SubViewMixin],
        /**
         * Generates the full schema to build the form inputs
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            return _buildServiceSchema(this);
        },

        /**
         * @returns {object}
         */
        getInitialValues() {
            const {
                event
            } = this.props;

            const selectedService = event.get('selectedService');
            const modifiedEvent = event.get('modifiedEvent');
            const service = extractSelectedService(event, selectedService.get('id'));

            let initialValues = _.assign(_.pick(service.toJS(), [
                'groupcode',
                'description'
            ]));

            const due = service.get('due');
            const fee = service.get('fee');

            if (due) {
                initialValues['due'] = DateTools.convertFromBalboaToDateString(due);
            }

            const flagList = service.get('flags_as_map');

            initialValues['amountType'] = 'specified';

            if (flagList && flagList.size) {
                flagList.map((flag, key) => {
                    if (key === 'free' && flag.get('is_set')) {
                        initialValues['amountType'] = 'free';
                    }

                    if (key === 'bill_later' && flag.get('is_set')) {
                        initialValues['amountType'] = 'bill_later';
                    }
                });
            }

            initialValues['amount'] = fee;

            return initialValues;
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;
            let updatedState;

            if (name === 'amountType' && value !== 'specified') {

                updatedState = {
                    amount: '0'
                };

            }
            else if (name === 'groupcode') {
                // find the group code data and pre-populate form
                const service = extractSpeakerService(this.props.speakerInfo, value);

                updatedState = {
                    amount: '',
                    amountFree: false,
                    amountActual: false,
                    description: ''
                };

                if (service) {
                    const fee = service.get('fee');
                    const due = service.get('due');

                    updatedState = _.assign(updatedState, service.toJS());

                    updatedState = _.assign(updatedState, {
                        amount: fee
                    });

                    if (fee === 'Free' || fee === 'Actual') {
                        updatedState = _.assign(updatedState, {
                            amount: '',
                            amountFree: (fee === 'Free'),
                            amountActual: (fee === 'Actual')
                        });
                    }

                    if (due) {
                        updatedState.due = DateTools.convertFromBalboaToDateString(due);
                    }
                }
            }

            if (updatedState) {
                this.setState({
                    data: _.assign({}, this.state.data, updatedState)
                });
            }

            dispatch(toggleViewDirty(true));
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event
            } = this.props;

            const selectedService = event.get('selectedService');

            let mode = this.determineMode(selectedService.get('id'));

            return <form
                ref='service-form'
                onSubmit={this.Form_onSubmit}>

                <Panel
                    headingText={getText('%1$s Service', {params: [mode]})}
                    headingIconClass='fa-dollar'>
                    {this.generateFields({
                        fields: _.pick(this.buildSchema(), ['groupcode', 'due', 'description'])
                    })}
                </Panel>

                <Panel
                    headingText={getText('Amount')}
                    headingIconClass='fa-dollar'>
                    {this.generateFields({
                        fields: _.pick(this.buildSchema(), ['amount'])
                    })}

                    <LinkCollapseArea ref='amountTypeOptionsArea'>
                        {this.generateFields({
                            fields: _.pick(this.buildSchema(), ['amountType'])
                        })}
                    </LinkCollapseArea>
                </Panel>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ServiceFormFactory }
