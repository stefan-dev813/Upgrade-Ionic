/**
 * Generates DetailsForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 * @returns {*} - React Component
 */
const DetailsFormFactory = (spec) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Enums
    const DELIVERY_METHOD_ICONS = require('../enums/DELIVERY_METHOD_ICONS').default;

    // Components
    const {SectionHeaderFactory} = require('../components/SectionHeader');
    const {ViewHeaderFactory} = require('../components/ViewHeader');
    const {
        LinkFactory
    } = require('../components');
    // Forms
    const MUIStatic = require('../forms/inputs/MUIStatic');
    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

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
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        isMarketPlaceEvent,
        prepareDetailsFormData,
        toggleEventDirty
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    const SectionHeader = SectionHeaderFactory({});
    const ViewHeader = ViewHeaderFactory({});
    const Link = LinkFactory({});


    //---------------------------------
    // Methods
    //---------------------------------

    let _buildRepSchema;
    let _buildZoomSchema;
    let _buildBureauSchema;
    let _buildEventDetailsSchema;
    let _generateBureauOptions;
    let _generateCompanyOptions;
    let _generateEventClassOptions;
    let _generateStatusOptions;
    let _generatePdRepOptions;
    let _generateSalesRepOptions;
    let _generateProjectManagerOptions;

    /**
     * Builds form input instructions for the Bureau section
     *
     * @returns {object}
     * @private
     */
    _buildRepSchema = (inst) => {
        const {
            companyData,
            event
        } = inst.props;

        let schema = {
            pd_rep_id: {
                name: "pd_rep_id",
                type: "select",
                label: 'PD Rep',
                options: _generatePdRepOptions(companyData.get('companyLists').get('pd_reps'))
            },
            sales_rep_id: {
                name: "sales_rep_id",
                type: "select",
                label: 'Sales Rep',
                options: _generateSalesRepOptions(companyData.get('companyLists').get('sales_reps'))
            },
            project_manager_id: {
                name: "project_manager_id",
                type: "select",
                label: 'Project Manager',
                options: _generateProjectManagerOptions(companyData.get('companyLists').get('project_managers'))
            }
        };

        if (!isEspeakers() || isMarketPlaceEvent(event.get('modifiedEvent'))) {
            _.map(schema, (field) => {
                field['disabled'] = true;

                return field;
            });
        }
        return schema;
    };

    /**
     * Builds form input instructions for the Zoom section
     *
     * @returns {object}
     * @private
     */
    _buildZoomSchema = (inst) => {
        const {
            event
        } = inst.props;

        let schema = {
            zoomUrl: {
                name: "zoomUrl",
                type: "textarea",
                label: 'Meeting URL',
                iconClass: 'videocam',
                showIcon: true,
                iconLink: event.get('selectedEvent').get('zoomUrl')
            }
        };

        if (!isEspeakers() || isMarketPlaceEvent(event.get('modifiedEvent'))) {
            _.map(schema, (field) => {
                field['disabled'] = true;

                return field;
            });
        }
        return schema;
    };

    /**
     * Builds form input instructions for the Bureau section
     *
     * @returns {object}
     * @private
     */
    _buildBureauSchema = (inst) => {
        const {
            displayData,
            event
        } = inst.props;

        const displayLists = displayData.get('displayLists');
        const bureauMap = displayData.get('bureauMap');

        let schema = {
            bureauID: {
                name: "bureauID",
                type: "filteredSelect",
                label: (isSolutionTree() ? 'PD Rep' : getText('Bureau')),
                iconClass: 'fa-building-o',
                optionMap: bureauMap.set('0', getText('None -- Direct')),
                optionBuilder: () => {
                    return _generateBureauOptions(inst);
                }
            },
            bureauNotes: {
                name: "bureauNotes",
                type: "textarea",
                label: (isSolutionTree() ? 'Sales Rep' : getText('Bureau Notes')),
                iconClass: 'fa-pencil-square-o'
            }
        };

        if (!isEspeakers() || isMarketPlaceEvent(event.get('modifiedEvent'))) {
            _.map(schema, (field) => {
                field['disabled'] = true;

                return field;
            });
        }
        return schema;
    };

    /**
     * Builds form input instructions for the Event Details section
     *
     * @returns {object}
     * @private
     */
    _buildEventDetailsSchema = (inst) => {

        const {
            auth,
            event,
            speakerInfo
        } = inst.props;

        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        let schema = {
            eid: {
                name: "eid",
                type: "text",
                label: 'Event #',
                disabled: true
            },
            organization: {
                name: "organization",
                type: "text",
                label: getText('Presenting to'),
                iconClass: 'fa-group',
                validate: v.required
            },
            meetingname: {
                name: "meetingname",
                type: "text",
                label: getText('Event Reason'),
                iconClass: 'fa-bookmark-o'
            },
            status: {
                name: "status",
                type: "select",
                label: getText('Status'),
                iconClass: 'fa-hourglass-1',
                options: _generateStatusOptions(inst),
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
            isPersonal: {
                name: "isPersonal",
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
            },
            arrivalNotes: {
                name: "arrivalNotes",
                type: "textarea",
                label: 'Schedule Notes',
                iconClass: 'fa-file-text-o'
            }
        };

        if (isSolutionTree()) {
            schema.coaching = {
                name: 'coaching',
                label: 'Virtual Coaching',
                type: "toggle"
            };

            schema = _.omit(schema, ['meetingname', 'arrivalNotes']);
        }

        if (!isEspeakers() || isMarketPlaceEvent(event.get('modifiedEvent'))) {
            _.map(schema, (field) => {
                field['disabled'] = true;

                return field;
            });
        }

        return schema;
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
        if (pd_reps) {
            pd_reps.map((pd_rep) => {
                options.push({
                    text: pd_rep.get('fullname'),
                    value: pd_rep.get('id').toString()
                });
            });
        }

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

        if (sales_reps) {
            sales_reps.map((sales_rep) => {
                options.push({
                    text: sales_rep.get('fullname'),
                    value: sales_rep.get('id').toString()
                });
            });
        }

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

        if (pms) {
            pms.map((pm) => {
                options.push({
                    text: pm.get('fullname'),
                    value: pm.get('id').toString()
                });
            });
        }

        return _.sortBy(options, 'text');
    };

    /**
     * Generates the Select options for the Bureau Selector
     * TODO: This isn't very DRY.  Exists in both DetailsForm and NewEventForm.  Maybe put in Mixin
     * @param {array} bureaus - Collection of bureaus from the server
     * @returns {Array}
     * @private
     */
    _generateBureauOptions = (inst) => {
        const {
            displayData
        } = inst.props;

        const displayLists = displayData.get('displayLists');

        const bureaus = displayLists.get('universal').get('bureaus');

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
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateCompanyOptions = (inst) => {
        const {
            displayData
        } = inst.props;

        const displayLists = displayData.get('displayLists');

        const companies = displayLists.get('universal').get('eventcompany');

        let options = [];

        companies.map((company) => {
            options.push({
                text: company.get('name'),
                value: company.get('id')
            });
        });

        return options;
    };

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateEventClassOptions = (inst) => {
        const {
            displayData
        } = inst.props;

        const displayLists = displayData.get('displayLists');

        const eventClasses = displayLists.get('universal').get('eventclass');

        let options = [];

        if (eventClasses) {
            eventClasses.map((eventClass) => {
                options.push({
                    text: eventClass.get('name'),
                    value: eventClass.get('id')
                });
            });
        }

        return options;
    };

    /**
     * Generates the Select options for the Status Selector
     * TODO: This isn't very DRY.  Exists in both DetailsForm and NewEventForm.  Maybe put in Mixin
     * @param {array} eventStatuses - Collection of event statuses from the server
     * @returns {Array}
     * @private
     */
    _generateStatusOptions = (inst) => {
        const {
            displayData
        } = inst.props;

        const displayLists = displayData.get('displayLists');

        const eventStatuses = displayLists.get('universal').get('eventstatuses');

        let options = [];

        eventStatuses.map((status) => {
            options.push({
                text: status.get('description'),
                value: status.get('description')
            });
        });

        return options;
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired,
            companyData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'event',
            'jobBoard',
            'nav',
            'speakerInfo',
            'displayData',
            'companyData',
            'auth'
        ]
    });

    //=========================================================================
    //
    // React / Public Interfaces
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'DetailsForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines the form input instructions
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            return _.assign({}, _buildEventDetailsSchema(this), _buildBureauSchema(this), _buildRepSchema(this));
        },

        /**
         * Returns pre-filled values for the form based on the props
         *
         * @param props
         * @returns {object}
         * @overrides FormMixin
         */
        getInitialValues(props) {
            const {
                event
            } = props;

            const modifiedEvent = event.get('modifiedEvent');

            let initialValues = {
                eid: _.toString(modifiedEvent.get('eid')),
                arrivalNotes: modifiedEvent.get('arrivalNotes'),
                bureauNotes: modifiedEvent.get('bureauNotes'),
                organization: modifiedEvent.get('organization'),
                status: (modifiedEvent.get('status') ? modifiedEvent.get('status').toString() : null),
                isPersonal: modifiedEvent.get('isPersonal'),
                deliveryMethod: (modifiedEvent.get('deliveryMethod') ? modifiedEvent.get('deliveryMethod').toString() : '0'),
                meetingname: modifiedEvent.get('meetingname'),
                zoomUrl: modifiedEvent.get('zoomUrl'),
                bureauID: (modifiedEvent.get('bureauID') ? modifiedEvent.get('bureauID').toString() : '0')
            };
            if (isSolutionTree()) {
                initialValues.pd_rep_id = (modifiedEvent.get('pd_rep_id') ? modifiedEvent.get('pd_rep_id').toString() : '0');
                initialValues.sales_rep_id = (modifiedEvent.get('sales_rep_id') ? modifiedEvent.get('sales_rep_id').toString() : '0');
                initialValues.project_manager_id = (modifiedEvent.get('project_manager_id') ? modifiedEvent.get('project_manager_id').toString() : '0');
            };

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         * @overrides FormMixin
         */
        onFormChanged: function (name, value) {
            const {
                dispatch
            } = this.props;

            // TODO: this would definitely get the model updated, but might be too expensive
            // mergeModifiedEvent(this.state.data);
            dispatch(toggleEventDirty(this.Form_areChangesMade()));
        },

        prepareFormData() {
            let formData = _.clone(this.state.data);

            return prepareDetailsFormData(formData);
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            let {
                event
            } = this.props;

            return (
                <form
                    ref='details-form'
                    onSubmit={this.Form_onSubmt}>

                    <ViewHeader label={getText('Event Details')}/>

                    {this.generateFields({fields: _buildEventDetailsSchema(this)})}

                    <div>
                        <SectionHeader label={getText('Meeting Url')}/>
                        {this.generateFields({fields: _buildZoomSchema(this)})}
                    </div>

                    {isSolutionTree() && <div>
                        <SectionHeader label={getText('Staff')} />
                        {this.generateFields({fields: _buildRepSchema(this)})}
                    </div>}
                    {!isSolutionTree() && <div>
                        <SectionHeader label={getText('Bureau')}/>
                        {this.generateFields({fields: _buildBureauSchema(this)})}
                    </div>}


                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DetailsFormFactory }