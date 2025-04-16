/**
 * Generates a NewEventForm component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes DateTools
 */
const NewEventFormFactory = (spec) => {

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
        is,
        List
    } = require('immutable');
    const {
        connect
    } = require('react-redux');

    // Enums
    const BTN = require('../enums/BTN').default;
    const DELIVERY_METHOD_ICONS = require('../enums/DELIVERY_METHOD_ICONS').default;

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Components
    const {PanelFactory} = require('../components/Panel');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');
    const {
        isEspeakers,
        isSolutionTree
    } = require('../util/Platform').default;

    // Actions
    const {
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    const Panel = PanelFactory({});

    /**********************************
     * Actions
     *********************************/

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

    let _generateTodoListOptions;
    let _generateBureauOptions;
    let _generateStatusOptions;
    let _updateHeaderActions;
    let _generatePdRepOptions;
    let _generateSalesRepOptions;
    let _generateProjectManagerOptions;

    /**
     * Generates the Select options for the TodoList Selector
     *
     * @param {object} displayLists
     * @param {object} selectedSpeaker
     * @returns {Array}
     * @private
     */
    _generateTodoListOptions = (displayLists, selectedSpeaker) => {
        let todoLists = List();
        let options = [];
        displayLists.get('perspeaker').map((speaker) => {
            if (speaker) {
                if (speaker.get('sid').toString() === selectedSpeaker.get('sid').toString() && List.isList(speaker.get('todolists'))) {
                    todoLists = speaker.get('todolists');
                }
            }
        });

        todoLists.map((todoList) => {
            if (todoList) {
                options.push({
                    text: todoList.get('listname'),
                    value: todoList.get('id').toString()
                });
            }
        });

        return options;
    };

    /**
     * Generates the Select options for the Bureau Selector
     *
     * @param {array} bureaus - Collection of bureaus from the server
     * @returns {Array}
     * @private
     */
    _generateBureauOptions = (bureaus) => {
        let options = [];

        options.push({
            text: getText('None -- Direct'),
            value: '0'
        });

        bureaus.map((bureau) => {
            options.push({
                text: bureau.get('bname'),
                value: bureau.get('bid')
            });
        });

        return options;
    };

    /**
     * Generates the Select options for the PD Rep Selector
     *
     * @param {array} pd_reps - Collection of pd_reps from the server
     * @returns {Array}
     * @private
     */
    _generatePdRepOptions = (pd_reps) => {
        let options = [];

        options.push({
            text: getText('None -- Direct'),
            value: '0'
        });

        pd_reps.map((pd_rep) => {
            options.push({
                text: pd_rep.get('fullname'),
                value: pd_rep.get('id').toString()
            });
        });

        return _.sortBy(options, 'text');
    };

    /**
     * Generates the Select options for the Sales Rep Selector
     *
     * @param {array} pd_reps - Collection of sales_reps from the server
     * @returns {Array}
     * @private
     */
    _generateSalesRepOptions = (sales_reps) => {
        let options = [];

        options.push({
            text: getText('None -- Direct'),
            value: '0'
        });

        sales_reps.map((sales_rep) => {
            options.push({
                text: sales_rep.get('fullname'),
                value: sales_rep.get('id').toString()
            });
        });

        return _.sortBy(options, 'text');
    };

    /**
     * Generates the Select options for the Project Manager Selector
     *
     * @param {array} pd_reps - Collection of project managers from the server
     * @returns {Array}
     * @private
     */
    _generateProjectManagerOptions = (pms) => {
        let options = [];

        options.push({
            text: getText('None -- Direct'),
            value: '0'
        });

        pms.map((pm) => {
            options.push({
                text: pm.get('fullname'),
                value: pm.get('id').toString()
            });
        });

        return _.sortBy(options, 'text');
    };

    /**
     * Generates the Select options for the Status Selector
     *
     * @param {array} eventStatuses - Collection of event statuses from the server
     * @returns {Array}
     * @private
     */
    _generateStatusOptions = (eventStatuses) => {
        let options = [];

        eventStatuses.map((status) => {
            options.push({
                text: status.get('description'),
                value: status.get('description')
            });
        });

        return options;
    };

    _updateHeaderActions = (spec) => {
        const {
            props,
            isDirty,
            inst
        } = spec;

        const {
            dispatch
        } = props;

        let actions = [];

        if (isDirty) {
            actions = [{
                type: BTN.SAVE,
                onClick: inst.onSubmit
            }, {
                type: BTN.DISCARD,
                onClick: inst.onDiscard
            }];
        }

        dispatch(setHeaderActions(actions));
    };

    /**********************************
     * Mixins
     *********************************/

    const EventMixin = EventMixinFactory({
        overrides: {
            updateHeaderActions() {
                const {
                    view
                } = this.props;

                _updateHeaderActions({
                    props: this.props,
                    isDirty: view.get('dirty'),
                    inst: this
                });
            },
            componentWillReceiveProps(nextProps) {
                const nextView = nextProps.view;
                const currentView = this.props.view;


                // update header if dirty changes
                if (nextView.get('dirty') !== currentView.get('dirty')) {
                    _updateHeaderActions({
                        props: nextProps,
                        isDirty: nextView.get('dirty'),
                        inst: this
                    });
                }
            }
        }
    });

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            companyData: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'nav',
            'view',
            'speakerInfo',
            'jobBoard',
            'event',
            'displayData',
            'companyData',
            'auth'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass(_.assign({

        /**
         * Used in debug messaging
         */
        displayName: 'NewEventForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Generates the full schema to build the form inputs
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, this.buildEventDetailsSchema());
        },

        /**
         * Generates the Event Details schema for form inputs
         *
         * @returns {object}
         */
        buildEventDetailsSchema() {
            const {
                companyData,
                displayData,
                speakerInfo,
                auth
            } = this.props;
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const displayLists = displayData.get('displayLists');
            const bureauMap = displayData.get('bureauMap');
            const {
                data
            } = this.state;

            let schema = _.assign(this.buildStartStopDateTimeSchema(data), {
                organization: {
                    name: "organization",
                    type: "text",
                    label: getText('Presenting to'),
                    iconClass: 'business',
                    validate: v.required
                },
                status: {
                    name: "status",
                    type: "select",
                    iconClass: 'settings',
                    label: getText('Status'),
                    options: _generateStatusOptions(displayLists.get('universal').get('eventstatuses')),
                    validate: (s) => {
                        const authedUserSession = auth.get('authedUserSession');

                        // TODO: wouldn't it be better to just not include the option if they aren't PRO?
                        let has_pro = _.includes(authedUserSession.get('getSIDsAtPackageLevel')('PRO'), esUtils.toInt(selectedSpeaker.get('sid')));

                        if (s === "lead" && !has_pro) {
                            return getText("Only PRO users can have '%1$s' events", {
                                params: [s]
                            });
                        }

                        return true;
                    }
                },
                personal: {
                    name: "personal",
                    type: "toggle",
                    label: getText('Personal/Blackout')
                },
                deliveryMethod: {
                    name: "deliveryMethod",
                    type: "select",
                    iconClass: 'fa-slideshare',
                    label: getText((isSolutionTree() ? 'Delivery Method' : 'Event Type')),
                    options: [{
                        text: DELIVERY_METHOD_ICONS['0'].label,
                        value: '0'
                    }, {
                        text: DELIVERY_METHOD_ICONS['1'].label,
                        value: '1'
                    }, {
                        text: DELIVERY_METHOD_ICONS['3'].label,
                        value: '3'
                    }, {
                        text: DELIVERY_METHOD_ICONS['2'].label,
                        value: '2'
                    }]
                }
            });

            // if (isSolutionTree()) {
            //     _.set(schema, ["pd_rep_id"], {
            //         name: "pd_rep_id",
            //         type: "select",
            //         label: 'PD Rep',
            //         options: _generatePdRepOptions(companyData.get('companyLists').get('pd_reps'))
            //     });
            //     _.set(schema, ["sales_rep_id"], {
            //         name: "sales_rep_id",
            //         type: "select",
            //         label: 'Sales Rep',
            //         options: _generateSalesRepOptions(companyData.get('companyLists').get('sales_reps'))
            //     });
            //     _.set(schema, ["project_manager_id"], {
            //         name: "project_manager_id",
            //         type: "select",
            //         label: 'Project Manager',
            //         options: _generateProjectManagerOptions(companyData.get('companyLists').get('project_managers'))
            //     });
            // }

            /**
             * Only add bureau, zoomUrl, and todolists if we are on espeakers
             */
            if (isEspeakers()) {
                _.set(schema, ["bureau"], {
                    name: "bureau",
                    type: "filteredSelect",
                    label: 'Bureau',
                    optionMap: bureauMap.set('0', getText('None -- Direct')),
                    optionBuilder: () => {
                        return _generateBureauOptions(displayLists.get('universal').get('bureaus'));
                    }
                });
                _.set(schema, ["zoomUrl"], {
                    name: "zoomUrl",
                    type: "textarea",
                    label: 'Meeting URL',
                    iconClass: 'fa-slideshare'
                });
                _.set(schema, ["todolists"], {
                    name: 'todolists',
                    type: 'select',
                    label: getText('Actions List'),
                    iconClass: 'fa-check-square-o',
                    options: _generateTodoListOptions(displayLists, selectedSpeaker)
                });
            }

            /**
             * Disable deliveryMethod, personal and status if we are on SolutionTree
             */
            if (isSolutionTree()) {
                _.map(_.pick(schema, ['deliveryMethod', 'personal', 'status']), (field, key) => {
                    field['disabled'] = true;

                    if (key === 'deliveryMethod') {
                        field['type'] = 'hidden';
                    }

                    return field;
                });
            }

            return schema;
        },

        /**
         * Sets the initial values of a form
         *
         * @returns {object}
         */
        getInitialValues() {
            let initValues = {
                bureau: '0',
                status: 'held',
                deliveryMethod: '1',
                todolists: '0',
                personal: false
            };

            if (!isEspeakers()) {
                initValues = _.assign(initValues, {
                    personal: true,
                    status: 'confirmed'
                });
            }

            return initValues;
        },

        /**
         * Submits the form when changes are saved.
         *
         * @returns {object}
         */
        onSubmit(event) {
            this.Form_onSubmit(event);
        },

        /**
         * Determines whether prerequisite Date/Time values are required
         *
         * @returns {object}
         */
        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            let newData = this.onFormChangedStartStopDateTime(name, value);

            if (newData) {
                this.setState({
                    data: newData
                });
            }

            const viewDirty = this.Form_areChangesMade();

            dispatch(toggleViewDirty(viewDirty));
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <form
                ref='newEvent-form'
                onSubmit={this.Form_onSubmit}>

                {this.generateFields({fields: this.buildEventDetailsSchema()})}
            </form>;
        }
    }));

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { NewEventFormFactory }