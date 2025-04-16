/**
 * Creates an StageTimeForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const StageTimeFormFactory = (spec) => {
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
        is
    } = require('immutable');
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
        VenueMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Forms
    const {
        PanelFactory
    } = require('../components');

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        StageTimeActionsFactory,
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
        showDeleteConfirmation
    } = DialogActionsFactory({});
    const {
        isMarketPlaceEvent,
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        deleteStageTime
    } = StageTimeActionsFactory({});
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

    let _actionDeleteStageTime;
    let _avCheckDateRequired;
    let _generateVenueOptions;
    let _updateHeaderActions;

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteStageTime = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    dispatch,
                    event
                } = inst.props;
                const selectedStageTime = event.get('selectedStageTime');

                dispatch(toggleEventDirty(true));
                dispatch(deleteStageTime({
                    id: selectedStageTime.get('id')
                }));
                dispatch(toggleViewDirty(false));
                dispatch(popSubView());
            },
            text: getText('Are you sure you want to delete this %1$s?', {
                params: [getText('Stagetime')]
            })
        }));
    };

    /**
     *
     * @param data
     * @returns {boolean}
     * @private
     */
    _avCheckDateRequired = (data) => {
        const {
            avchecktime
        } = data;

        if (_.isDate(avchecktime)) {
            return true;
        }

        return false;
    };

    /**
     *
     * @param {List} venueList
     * @returns {Array}
     * @private
     */
    _generateVenueOptions = (venueList) => {
        let options = [];

        venueList.map((venue) => {
            options.push({
                text: esUtils.venue_to_string(venue.toJS()),
                value: venue.get('id')
            });
        });

        return options;
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

        const selectedStageTime = event.get('selectedStageTime');

        let actions = inst.determineSaveAction(currentProps);

        if (selectedStageTime.get('id')
            && DateTools.parseNum(selectedStageTime.get('id')) !== 0
            && !isMarketPlaceEvent(event.get('modifiedEvent'))) {
            actions.push({
                iconClass: 'delete',
                label: getText('Delete'),
                onClick: (event) => {
                    stopProp(event);

                    _actionDeleteStageTime(inst);
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

    const FormHelperMixin = FormHelperMixinFactory({});
    const VenueMixin = VenueMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            view: PropTypes.object.isRequired,
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
        displayName: 'StageTimeForm',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin, VenueMixin, ViewMixin, SubViewMixin],
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

            const schema =  _.assign({}, this.buildStartStopDateTimeSchema(data), this.buildVenueSchema(data), {
                description: {
                    name: 'description',
                    label: getText('Description'),
                    type: 'text',
                    iconClass: 'mbsc-ic-none'
                },
                avcheckdate: {
                    name: 'avcheckdate',
                    label: getText('A/V Check Date'),
                    type: 'date',
                    iconClass: 'date-range',
                    maxDate: this.mergeDate(data.startDate, data.startTime),
                    validate: v.validateIf(_avCheckDateRequired(data), v.date)
                },
                avchecktime: {
                    name: 'avchecktime',
                    label: getText('A/V Check Time'),
                    type: 'time',
                    iconClass: 'fa-clock-o',
                    maxDate: this.mergeDate(data.startDate, data.startTime),
                    validate: v.blankOr(v.date)
                },
                room: {
                    name: 'room',
                    label: getText('Room'),
                    type: 'text',
                    iconClass: 'fa-key'
                },
                venueid: {
                    name: 'venueid',
                    label: getText('Venue'),
                    placeholder: getText('-- Add new Venue --'),
                    type: 'select',
                    options: _generateVenueOptions(modifiedEvent.get('Venue')),
                    iconClass: 'fa-building-o'
                }
            });

            if(isMarketPlaceEvent(modifiedEvent)) {
                _.map(schema, (field) => {
                    field['disabled'] = true;

                    return field;
                });
            }

            return schema;
        },

        getInitialValues() {
            const {
                event
            } = this.props;

            const modifiedEvent = event.get('modifiedEvent');

            const selectedStageTime = event.get('selectedStageTime');

            const stageTimeList = modifiedEvent.get('Stagetime');

            let formStageTime = selectedStageTime;

            if (selectedStageTime) {
                stageTimeList.map((stageTime) => {
                    if (stageTime.get('id') === selectedStageTime.get('id')) {
                        formStageTime = stageTime;
                    }
                });
            }

            const venueValues = this.getInitialVenueValues(formStageTime.get('venueid'));

            // we need to only convert dates if they are set
            let initialValues = {};

            initialValues = _.assign(initialValues, venueValues);

            initialValues = _.assign(initialValues, {
                description: formStageTime.get('description'),
                room: formStageTime.get('room'),
                venueid: (formStageTime.get('venueid') || '0').toString()
            });

            if (this.isBalboaDate(formStageTime.get('starttime'))) {
                initialValues = _.assign(initialValues, {
                    startDate: this.convertFromBalboaToDate(formStageTime.get('starttime')),
                    startTime: this.convertFromBalboaToTime(formStageTime.get('starttime'))
                });
            }

            if (this.isBalboaDate(formStageTime.get('stoptime'))) {
                initialValues = _.assign(initialValues, {
                    stopDate: this.convertFromBalboaToDate(formStageTime.get('stoptime')),
                    stopTime: this.convertFromBalboaToTime(formStageTime.get('stoptime'))
                });
            }

            if (this.isBalboaDate(formStageTime.get('avchecktime'))) {
                initialValues = _.assign(initialValues, {
                    avcheckdate: this.convertFromBalboaToDate(formStageTime.get('avchecktime')),
                    avchecktime: this.convertFromBalboaToTime(formStageTime.get('avchecktime'))
                });
            }

            return initialValues;
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            let updatedData;

            updatedData = _.assign({},
                this.state.data,
                this.onFormChangedStartStopDateTime(name, value),
                this.onFormChangedVenue(name, value));


            if (!is(this.state.data, updatedData)) {
                this.setState({
                    data: updatedData
                });
            }

            dispatch(toggleViewDirty(this.Form_areChangesMade()));
        },

        /**
         * Invoked once immediately after the initial rendering occurs.
         */
        componentDidMount() {
            // Trigger updating the rest of the form with the selected venue
            this.onFormChanged('venueid', this.getInitialValues().venueid);
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const schema = this.buildSchema();

            const {
                event
            } = this.props;

            const selectedStageTime = event.get('selectedStageTime');

            let mode = this.determineMode(selectedStageTime.get('id'));

            return <form
                ref='stage-time-form'
                onSubmit={this.Form_onSubmit}>

                <Panel
                    headingText={getText('%1$s Stage Time', {params: [mode]})}
                    headingIconClass='fa-calendar'>
                    {this.generateFields({
                        fields: _.pick(schema, [
                            'description',
                            'startDate',
                            'startTime',
                            'stopDate',
                            'stopTime',
                            'avcheckdate',
                            'avchecktime',
                            'room'])
                    })}
                </Panel>

                <Panel
                    headingText={getText('Venue')}
                    headingIconClass='fa-building-o'>
                    {this.generateFields({fields: _.assign({}, _.pick(schema, ['venueid']), _.map(this.buildVenueSchema(this.state.data), (field) => {
                        if(isMarketPlaceEvent(event.get('modifiedEvent'))) {
                            field['disabled'] = true;

                            return field;
                        } else {
                            return field;
                        }
                    }))})}
                </Panel>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StageTimeFormFactory }
