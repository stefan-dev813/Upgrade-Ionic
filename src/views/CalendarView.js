/**
 * Generates CalendarView Component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioServiceMixin
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const CalendarViewFactory = (spec) => {
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
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');
    const {
        connect
    } = require('react-redux');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Factories
    const {
        CalendarLegendDialogFactory
    } = require('../components/dialogs');
    const {EventCalendarFactory} = require('../components/eventCalendar/EventCalendar');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;
    const DateTools = require('../util/DateTools').default({});
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        CalendarActionsFactory,
        DialogActionsFactory,
        EventActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    /**********************************
     * Factories
     *********************************/

    const CalendarLegendDialog = CalendarLegendDialogFactory({});
    const EventCalendar = EventCalendarFactory({});

    /**********************************
     * Actions
     *********************************/

    const {
        loadCalendarData,
        mergeCalendarData,
        updateSelectedMonthYear,
        updateSelectorYear
    } = CalendarActionsFactory({});
    const {
        showLegend,
        closeDialog
    } = DialogActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions
    } = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _legendClickHandler;
    let _loadCalendarData;
    let _todayClickHandler;

    /**
     *
     *
     * @param event
     * @private
     */
    _legendClickHandler = (event, inst) => {
        const {
            dispatch
        } = inst.props;

        stopProp(event);

        dispatch(showLegend());
    };

    /**
     *
     *
     * @param inst
     * @private
     */
    _loadCalendarData = (props) => {
        const {
            speakerInfo,
            calendar
        } = props;

        const selectedYear = calendar.get('selectedYear');
        const selectedMonth = calendar.get('selectedMonth');
        const calendarData = calendar.get('calendarData');

        if (!calendarData.get(`${selectedYear}-${selectedMonth}`)) {
            loadCalendarData(speakerInfo.get('selectedSpeaker'),
                selectedYear,
                selectedMonth);
        }
    };

    /**
     *
     * @param event
     * @param inst
     * @private
     */
    _todayClickHandler = (event, inst) => {
        stopProp(event);

        const {
            dispatch
        } = inst.props;

        const today = moment();

        dispatch(updateSelectedMonthYear({
            selectedMonth: today.month() + 1,
            selectedYear: today.year()
        }));

        dispatch(updateSelectorYear({
            selectorYear: today.year()
        }));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            dialog: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        },
        propsPriority: [
            'dialog',
            'calendar',
            'speakerInfo'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass(_.assign({}, {
        /**
         * Used for debug messages
         */
        displayName: 'CalendarView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin],
        /**
         * Registers the service channels we will be interacting with
         *
         * @returns {*}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.services.LOAD_CALENDAR] = {
                key() {
                    return RADIOS.services.LOAD_CALENDAR;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());
                        dispatch(mergeCalendarData(data));
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
         * Invoked once immediately after the initial rendering occurs
         */
        componentDidMount() {
            const {
                speakerInfo
            } = this.props;

            if (speakerInfo && speakerInfo.get('selectedSpeaker')) {
                _loadCalendarData(this.props);
            }

            this.updateHeaderActions();
        },
        /**
         * Invoked when a component is receiving new props. This method is not
         * called for the initial render.
         *
         * @param nextProps
         */
        componentWillReceiveProps(nextProps) {
            const {
                calendar,
                speakerInfo
            } = nextProps;

            // Only load calendar data if we don't have any for that date
            const calendarData = calendar.get('calendarData');
            const selectedYear = calendar.get('selectedYear');
            const selectedMonth = calendar.get('selectedMonth');

            const selectedSpeaker = speakerInfo.get('selectedSpeaker');

            const currentSpeakerInfo = this.props.speakerInfo;
            const currentSelectedSpeaker = currentSpeakerInfo.get('selectedSpeaker');

            // for a data load you need to have a sid, year, and month
            if (selectedSpeaker && selectedYear && selectedMonth) {
                let speakerSelected = (!currentSelectedSpeaker && selectedSpeaker);

                let speakerMismatch = (currentSelectedSpeaker &&
                    selectedSpeaker &&
                    currentSelectedSpeaker.get('sid').toString() !== selectedSpeaker.get('sid').toString());

                let missingCalendarData = !calendarData.get(`${selectedYear}-${selectedMonth}`);

                if (speakerSelected || speakerMismatch || missingCalendarData) {
                    _loadCalendarData(nextProps);
                }
            }
        },
        /**
         * Updates the icons/actions in the header
         *
         * @override ViewMixin
         */
        updateHeaderActions() {
            const {
                dispatch
            } = this.props;

            dispatch(setHeaderActions([{
                onClick: (e) => {
                    stopProp(e);

                    _todayClickHandler(e, this);
                },
                primary: true,
                label: getText('Today'),
                iconClass: 'my-location'
            }, {
                onClick: (e) => {
                    stopProp(e);

                    _legendClickHandler(e, this);
                },
                primary: false,
                label: getText('Legend'),
                iconClass: 'info'
            }]));
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                dialog,
                dispatch
            } = this.props;

            const showLegend = dialog.get('showLegend');

            return <div className='calendar-view'>
                <CalendarLegendDialog
                    widgetId='calendar-legend'
                    showWidget={showLegend}
                    onClose={() => {
                        dispatch(closeDialog());
                    }}
                />

                <EventCalendar/>

            </div>;
        }
    }));

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CalendarViewFactory }
