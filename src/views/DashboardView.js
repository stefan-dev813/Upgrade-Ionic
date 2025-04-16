/**
 * Generates a DashboardView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const DashboardViewFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const _ = require('lodash');
    const {
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');
    const {
        connect
    } = require('react-redux');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../util/DevTools').default;
    const DateTools = require('../util/DateTools').default({});
    const {
        isEspeakers
    } = require('../util/Platform').default;

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Lists
    const {
        ActivityListFactory,
        PipelineListFactory,
        TodoListFactory,
        UpcomingConfirmedListFactory
    } = require('../components/list');

    const {TipCardFactory} = require('../components/cards');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../mixins');

    // Actions
    const {
        DashboardActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

        // Lists
    const ActivityList = ActivityListFactory({});
    const PipelineList = PipelineListFactory({});
    const TipCard = TipCardFactory({});
    const TodoList = TodoListFactory({});
    const UpcomingConfirmedList = UpcomingConfirmedListFactory({});

    /**********************************
     * Actions
     *********************************/

    const {
        updateDashboardStore,
        loadDashboard
    } = DashboardActionsFactory({});
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});

    /**********************************
     * Methods
     *********************************/


    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dashboard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            auth: PropTypes.object.isRequired
        },
        propsPriority: [
            'dashboard',
            'speakerInfo',
            'auth'
        ]
    });

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debugging message
         */
        displayName: 'DashboardView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin, ViewMixin],
        /**
         * Sets up the Service radio channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.services.LOAD_DASHBOARD] = {
                key() {
                    const {
                        speakerInfo,
                        auth
                    } = this.props;

                    let company = auth.get('authedUserSession').get("balboa").get("company") || 2;

                    return `${speakerInfo.get('selectedSpeaker').get('sid')}_${company}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateDashboardStore(_.assign({
                            lastUpdated: new Date()
                        }, data)));
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        // TODO: i18n error messages
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
         * Triggers when the component receives a new set of properties.  Refreshes the screen if a new selectedSpeaker
         * is passed in.
         *
         * @param nextProps
         */
        componentWillReceiveProps(nextProps) {
            const {
                speakerInfo,
                auth
            } = nextProps;

            const selectedSpeaker = speakerInfo.get('selectedSpeaker');

            const currentSpeakerInfo = this.props.speakerInfo;
            const currentSelectedSpeaker = currentSpeakerInfo.get('selectedSpeaker');

            let speakerMismatch = (currentSelectedSpeaker &&
            selectedSpeaker &&
            selectedSpeaker.get('sid') &&
            currentSelectedSpeaker.get('sid') &&
            currentSelectedSpeaker.get('sid').toString() !== selectedSpeaker.get('sid').toString());

            if (speakerMismatch) {
                if (isEspeakers()) {
                    loadDashboard({
                        sid: selectedSpeaker.get('sid')
                    });
                } else {
                    loadDashboard({
                        sid: selectedSpeaker.get('sid'),
                        company_id: auth.get('authedUserSession').get("balboa").get("company")
                    });
                }
            }
        },
        /**
         * Triggers after the component and all child components render.  Calls to load the dashboard data
         */
        componentDidMount() {
            const {
                dashboard,
                speakerInfo,
                auth
            } = this.props;

            if (speakerInfo &&
                speakerInfo.get('selectedSpeaker') &&
                speakerInfo.get('selectedSpeaker').get('sid') && !dashboard.get('lastUpdated')) {
                if (isEspeakers()) {
                    loadDashboard({
                        sid: speakerInfo.get('selectedSpeaker').get('sid')
                    });
                } else {
                    loadDashboard({
                        sid: speakerInfo.get('selectedSpeaker').get('sid'),
                        company_id: auth.get('authedUserSession').get("balboa").get("company")
                    });
                }
            }
        },
        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                dashboard
            } = this.props;

            // if (!dashboard.get('lastUpdated')) {
            //     return <div></div>;
            // }

            return <div>
                {isEspeakers() ?
                    <PipelineList/>
                    : null}

                {isEspeakers() ?
                    <TipCard/>
                    : null}

                {isEspeakers() ?
                    <TodoList canComplete={false}/>
                    : null}

                <ActivityList/>

                <UpcomingConfirmedList/>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DashboardViewFactory }
