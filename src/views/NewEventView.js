/**
 * Generates a NewEventView component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const NewEventViewFactory = (spec) => {
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
    const moment = require('moment');

    // Radio
    const {
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');

    // Factories
    const {NewEventFormFactory} = require('../forms/NewEventForm');
    const {FormLoadingFactory} = require('../components/FormLoading');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Radio
    const RADIOS = require('../enums/RADIOS').default;

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');
    const DateToolsFactory = require('../util/DateTools').default;
    const {
        isSolutionTree
    } = require('../util/Platform').default;
    // Actions
    const {
        EventActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        selectEvent
    } = EventActionsFactory({});
    const {
        hideLoading,
        showLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildDateTimeString;
    let _submitHandler;

    /**
     * Handles the NewEventForm submission
     * @param {object} form - Form values
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            speakerInfo,
            auth
        } = inst.props;

        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        let sid = _.parseInt(selectedSpeaker.get('sid'));

        let startDateTime = DateTools.mergeDate(form.startDate, form.startTime);
        let stopDateTime = DateTools.mergeDate(form.stopDate, form.stopTime);

        let stageTime = {};

        if (startDateTime) {
            stageTime = {
                Stagetime: [
                    {
                        starttime: startDateTime,
                        stoptime: stopDateTime
                    }
                ]
            };
        }

        let newEvent = _.assign({
            eid: 0,
            companyId: auth.get("sessionData").get("company") || 2,
            sids: [sid],
            zoomUrl: ((_.has(form, ['zoomUrl']) && !_.isEmpty(form['zoomUrl']) && !_.startsWith(_.toLower(form['zoomUrl']), 'http://') && !_.startsWith(_.toLower(form['zoomUrl']), 'https://')) ? ('https://' + form['zoomUrl']) : form['zoomUrl']),
            organization: form.organization,
            status: form.status,
            isPersonal: form.personal,
            deliveryMethod: form.deliveryMethod,
            bureauID: esUtils.toInt(form.bureau),
            todolistids: [{
                sid: sid,
                listid: _.parseInt(form.todolist || 0)
            }]
        }, stageTime);

        if (!isSolutionTree()) {
            _.set(newEvent, ["pd_rep_id"], esUtils.toInt(form.pd_rep_id));
            _.set(newEvent, ["sales_rep_id"], esUtils.toInt(form.sales_rep_id));
            _.set(newEvent, ["project_manager_id"], esUtils.toInt(form.project_manager_id));
        }

        radio(RADIOS.services.SAVE_EVENT).broadcast({
            event: newEvent
        });
    };

    /**********************************
     * Factories
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired,
            auth: PropTypes.object.isRequired
        },
        propsPriority: [
            'view',
            'speakerInfo',
            'auth'
        ]
    });

    const NewEventForm = NewEventFormFactory({});
    const FormLoading = FormLoadingFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'NewEventView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin],
        /**
         * Sets up the Service Radio channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.services.SAVE_EVENT] = {
                key() {
                    return "0"; //RADIOS.services.SAVE_EVENT.toString();
                },
                on: {
                    waiting() {
                        // dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        if (data && data.event && data.event.eid) {
                            dispatch(selectEvent({
                                event: data.event
                            }));
                        }
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));
                    }
                }
            };

            return radios;
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return (
                <FormLoading>
                    <NewEventForm
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

export { NewEventViewFactory }