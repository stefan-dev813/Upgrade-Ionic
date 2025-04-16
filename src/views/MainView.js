/* global navigator */

/**
 * Creates the MainView React Components
 *
 * @param {object} spec - Container for all named parameters
 * @constructor
 *
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 *
 * @return {function}
 */
const MainViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const Balboa = require('ES/services/Balboa');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const Immutable = require('immutable');
    const {
        is,
        fromJS
    } = Immutable;
    const {
        connect
    } = require('react-redux');

    // Material UI
    const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
    const ThemeOverride = require('../theme/mui/ThemeOverride').default;

    const Platform = require('../util/Platform').default;

    // Services
    const JobBoardService = require('../services/JobBoardService').default;

    // Enums
    const GENERAL = require('../enums/GENERAL').default;
    const VIEWS = require('../enums/VIEWS').default;
    const RADIOS = require('../enums/RADIOS').default;

    // Factories
    const {LoadingScreenFactory} = require('../components/LoadingScreen');
    const {LoginViewFactory} = require('../views/LoginView');
    const {NavigatorFactory} = require('./NavWrapperView');
    const {SplashScreenFactory} = require('../components/SplashScreen');
    const {PushManagerFactory} = require('../components/PushManager');

    // Radios
    const {
        RadioServiceMixin,
        radio
    } = require("react-pubsub-via-radio.js");

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Utilities
    const {
        convertToBalboaTrunkTimestamp
    } = require('../util/DateTools').default({});
    const {
        convertBalboa3EventToJSEvent
    } = require('ES/utils/esUtils');
    const {
        hasPush
    } = require('../util/Platform').default;

    // Actions
    const {
        AuthActionsFactory,
        CompanyDataActionsFactory,
        DialogActionsFactory,
        DisplayDataActionsFactory,
        EventActionsFactory,
        JobBoardActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
        NavActionsFactory,
        SpeakerInfoActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    require('../services/index');
    require('../forms/MUIInputs').default.install(require("react-loose-forms/InputTypes"));

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        renewToken,
        updateAuthStore
    } = AuthActionsFactory({});
    const {
        closeDialog
    } = DialogActionsFactory({});
    const {
        updateCompanyDataStore,
        getCompanyLists
    } = CompanyDataActionsFactory({});
    const {
        updateDisplayDataStore,
        getDisplayLists
    } = DisplayDataActionsFactory({});
    const {
        mergeEventData,
        clearEvent,
        clearEventAssociatedData,
        fixCustomFields,
        isMarketPlaceEvent,
        selectEvent,
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        loadJobBoard,
        loadJobMessages,
        selectJob,
        updateJobAgreement,
        updateJobDetail,
        updateJobBoardStore,
        updateJobMessages
    } = JobBoardActionsFactory();
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});
    const {
        changeEventView,
        changeMainView,
        setSubView,
        clearSubView
    } = NavActionsFactory({});
    const {
        updateShortProfile,
        updateSpeakerInfoStore
    } = SpeakerInfoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        clearSubmitForm,
        toggleKeyboardActive,
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Views / Components
     *********************************/

    const LoadingScreen = LoadingScreenFactory({});
    const LoginView = LoginViewFactory({});
    const Navigator = NavigatorFactory({});
    const PushManager = PushManagerFactory({});
    const SplashScreen = SplashScreenFactory({});

    /**********************************
     * Methods
     *********************************/

    let _authHandler;
    let _determineSpeaker;
    let _determineView;
    let _failToLogin;
    let _initializeBalboa;
    let _storeLoadedEvent;
    let _verifyCompanyListsHandler;
    let _verifyDisplayListsHandler;
    let _verifyJobBoardHandler;

    /**
     * Handles post authentication.  Setups up the state and Balboa.
     *
     * @param {object} sessionData
     * @param {object} inst
     * @private
     */
    _authHandler = (sessionData, inst) => {
        const {
            dispatch
        } = inst.props;

        let speakerInfo = _determineSpeaker(sessionData.permissions, inst);

        dispatch(updateAuthStore({
            sessionData: sessionData
        }));

        dispatch(showLoading());

        dispatch(updateSpeakerInfoStore(speakerInfo));
    };

    /**
     * Takes in the various speaker collections, finds the correct one
     * and merges with existing speaker information.
     *
     * @param {array|object} collection - Object or Array of speakers
     * @param {object} inst - Reference to React Component
     * @returns {object}
     * @private
     */
    _determineSpeaker = (collection, inst) => {
        const {
            speakerInfo
        } = inst.props;

        let selectedSpeaker = speakerInfo.get('selectedSpeaker');

        // determine speaker mode
        let count = 0;
        let determinedSpeaker = null;
        let speakerList = [];

        _.map(collection, (speaker, key) => {
            count += 1;

            speakerList.push(_.pick(speaker, ['sid', 'name_full']));

            if (!selectedSpeaker || !selectedSpeaker.get('sid') ||
                selectedSpeaker.get('sid') === "undefined") {
                determinedSpeaker = speaker;
            }
            else if (speaker.sid &&
                selectedSpeaker.get('sid') &&
                speaker.sid.toString() === selectedSpeaker.get('sid').toString()) {
                determinedSpeaker = _.assign({}, selectedSpeaker.toJS(), speaker);
            }
            else if (selectedSpeaker.get('sid') &&
                key.toString() === selectedSpeaker.get('sid').toString()) {
                determinedSpeaker = _.assign({}, selectedSpeaker.toJS(), speaker);
            }

            if (determinedSpeaker && !determinedSpeaker.sid) {
                determinedSpeaker.sid = key;
            }
        });

        let updatedSpeakerInfo = {
            speakerMode: GENERAL.MULTIPLE_SPEAKER_MODE,
            speakerList: speakerList
        };

        if (selectedSpeaker && determinedSpeaker && selectedSpeaker.get('sid').toString() === determinedSpeaker.sid.toString()) {
            updatedSpeakerInfo = _.assign(updatedSpeakerInfo, {
                selectedSpeaker: determinedSpeaker
            });
        }

        if (count === 1) {
            updatedSpeakerInfo = _.assign(updatedSpeakerInfo, {
                speakerMode: GENERAL.SINGLE_SPEAKER_MODE,
                selectedSpeaker: determinedSpeaker
            });
        }

        return updatedSpeakerInfo;
    };

    /**
     * Determines what sub view to show based on the current state.
     *
     * @param {object} inst - Reference to React Component
     * @returns {XML} - React Component
     * @private
     */
    _determineView = (inst) => {
        let {
            auth,
            displayData,
            companyData
        } = inst.props;

        if (!auth || !auth.get('authedUserSession') || !auth.get('authedUserSession').get('is_logged_in')) {

            // if we are logging them in from a stored session token (renew token)
            // don't show the login screen.  Show the splash screen instead
            if (auth && auth.get('sessionData') && auth.get('sessionData').get('token')) {
                return <SplashScreen/>;
            }
            else {
                return <LoginView/>;
            }
        }

        if (!displayData || !displayData.get('timestamp') || !companyData || !companyData.get('timestamp')) {
            return <SplashScreen/>;
        }

        return <Navigator/>;
    };

    /**
     * Handles any case of authentication failure and sets up the state accordingly
     *
     * @param {string} error - Message from the service
     * @param {object} inst - Reference to React Component
     * @private
     */
    _failToLogin = (error, inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(hideLoading());

        dispatch(updateAuthStore({
            sessionData: {}
        }));

        dispatch(setMessage({
            type: 'error',
            text: error
        }));
    };

    /**
     * Given a configuration object, it initializes and sets up the Balboa service system.
     *
     * @param {object} balboa
     * @private
     */
    _initializeBalboa = (balboa) => {
        Balboa.init({
            balboa_prefix: Platform.getBalboaUrl(),
            extend_with_params: (balboa && _.isFunction(balboa.toJS) ? balboa.toJS() : {})
        });
    };


    /**
     * Merge or store the loaded event data on the immutable store for all event views to share
     *
     * @param {object} data
     * @param {function} dispatch
     * @private
     */
    _storeLoadedEvent = (data, dispatch) => {
        if (data.displayMessage && data.displayMessage.length > 1) {
            dispatch(setMessage({
                type: 'warning',
                text: data.displayMessage
            }));
        }

        const convertedEvent = fixCustomFields(convertBalboa3EventToJSEvent(data.event));

        dispatch(mergeEventData(convertedEvent));

        return convertedEvent;
    };

    /**
     * Verify that the locally stored and/or in memory display list data isn't
     * out of date (over 24 hours old).  If it is, then refresh it silently in
     * the background.
     *
     * @private
     */
    _verifyDisplayListsHandler = (inst) => {
        const {
            dispatch,
            displayData
        } = inst.props;

        // if display list is over 24 hours old, we need to refresh it silently
        let nowTime = convertToBalboaTrunkTimestamp(new Date());
        let diff = nowTime - displayData.get('timestamp');

        if (diff > 24 * 60 * 60) {
            dispatch(showLoading());

            getDisplayLists();
        }
    };

    /**
     * Verify that the locally stored and/or in memory display list data isn't
     * out of date (over 24 hours old).  If it is, then refresh it silently in
     * the background.
     *
     * @private
     */
    _verifyCompanyListsHandler = (inst) => {
        const {
            dispatch,
            companyData
        } = inst.props;

        // if display list is over 24 hours old, we need to refresh it silently
        let nowTime = convertToBalboaTrunkTimestamp(new Date());
        let diff = nowTime - companyData.get('timestamp');

        if (diff > 24 * 60 * 60) {
            dispatch(showLoading());

            getCompanyLists();
        }
    };

    /**
     * Verify that the locally stored and/or in memory display list data isn't
     * out of date (over 24 hours old).  If it is, then refresh it silently in
     * the background.
     *
     * @private
     */
    _verifyJobBoardHandler = (inst) => {
        const {
            dispatch,
            jobBoard
        } = inst.props;

        // if display list is over 24 hours old, we need to refresh it silently
        let nowTime = convertToBalboaTrunkTimestamp(new Date());
        let diff = nowTime - jobBoard.get('lastUpdated');

        if (diff > 24 * 60 * 60) {
            dispatch(showLoading());

            loadJobBoard();
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            browser: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired,
            companyData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            loading: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            overlay: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        propsPriority: [
            'loading',
            'overlay',
            'browser',
            'nav',
            'view',
            'jobBoard',
            'event',
            'auth',
            'speakerInfo',
            'displayData',
            'companyData'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'MainView',
        /**
         * Pulls in functionality from other mixin files
         *
         * @see RadioServiceMixin
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin],
        /**
         * Configures the Radio Service Channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            let radios = {};
            const {
                dispatch
            } = this.props;

            radios[RADIOS.services.RENEW_TOKEN] = {
                key() {
                    const {
                        auth
                    } = this.props;

                    return auth.get('sessionData').get('token');
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            auth
                        } = this.props;

                        dispatch(hideLoading());

                        // token renewal doesn't come with permission, so we need to merge the old with the new
                        data = _.assign(auth.get('sessionData').toJS(), data);

                        dispatch(updateAuthStore({
                            sessionData: data
                        }));

                        let speakerInfo = _determineSpeaker(data.permissions, this);

                        dispatch(updateSpeakerInfoStore(speakerInfo));
                    },
                    failed(error) {
                        _failToLogin(error, this);
                    }
                }
            };

            radios[RADIOS.services.GET_DISPLAY_LISTS] = {
                key() {
                    return RADIOS.services.GET_DISPLAY_LISTS;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        let speakerInfo = _determineSpeaker(data.perspeaker, this);
                        dispatch(updateSpeakerInfoStore(speakerInfo));

                        dispatch(updateDisplayDataStore({
                            displayLists: data,
                            timestamp: (convertToBalboaTrunkTimestamp(new Date()))
                        }));
                    },
                    failed(error) {
                        _failToLogin(error, this);
                    }
                }
            };

            radios[RADIOS.services.GET_COMPANY_LISTS] = {
                key() {
                    return RADIOS.services.GET_COMPANY_LISTS;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateCompanyDataStore({
                            companyLists: _.get(data, ["sitelists"]),
                            timestamp: (convertToBalboaTrunkTimestamp(new Date()))
                        }));
                    },
                    failed(error) {
                        _failToLogin(error, this);
                    }
                }
            };

            // These calls need to be outside of event views as they need to be shared amongst all of them
            // and there are multiple entry points to an event.  Ideally this would be outside a view entirely
            // which is possible to do with the Radio system, we just need to design the pattern for it.
            radios[RADIOS.services.LOAD_EVENT] = {
                key() {
                    const {
                        event
                    } = this.props;

                    const selectedEvent = event.get('selectedEvent');

                    return selectedEvent.get('eid').toString();
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            nav
                        } = this.props;
                        dispatch(hideLoading());

                        const convertedEvent = _storeLoadedEvent(data, dispatch);

                        // If it's a marketplace event, we need to default it to the job's view
                        let defaultView = VIEWS.eventViews.DETAILS_VIEW;

                        if(_.isEmpty(nav.mainView)) {
                            if(isMarketPlaceEvent(convertedEvent)) {
                                defaultView = VIEWS.eventViews.JOB_VIEW;
                            }

                            dispatch(changeEventView(defaultView));
                        }
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(changeMainView(VIEWS.mainViews.CALENDAR_VIEW));

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));
                    }
                }
            };

            radios[RADIOS.services.DELETE_EVENT] = {
                key() {
                    const {
                        event
                    } = this.props;
                    const selectedEvent = event.get('selectedEvent');
                    return selectedEvent.get('eid');
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded() {
                        dispatch(hideLoading());

                        dispatch(clearEventAssociatedData());

                        dispatch(clearEvent());

                        dispatch(setMessage({
                            type: 'success',
                            text: getText('Event Deleted')
                        }));
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

            radios[RADIOS.services.COPY_EVENT] = {
                key() {
                    const {
                        event
                    } = this.props;
                    const selectedEvent = event.get('selectedEvent');
                    return selectedEvent.get('eid');
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(eid) {
                        dispatch(hideLoading());

                        dispatch(toggleEventDirty(false));

                        dispatch(clearEventAssociatedData());

                        dispatch(selectEvent({
                            event: {
                                eid: eid
                            }
                        }));

                        dispatch(closeDialog());

                        dispatch(setMessage({
                            type: 'success',
                            text: getText('Event Copied')
                        }));
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));

                        dispatch(closeDialog());
                    }
                }
            };

            radios[RADIOS.services.SAVE_EVENT] = {
                key() {
                    const {
                        event
                    } = this.props;
                    const selectedEvent = event.get('selectedEvent');
                    return (selectedEvent ? selectedEvent.get('eid').toString() : "0");
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            nav,
                            view
                        } = this.props;
                        dispatch(hideLoading());

                        const currentView = nav.get('eventView');
                        const doSubmitFormCallback = view.get('doSubmitFormCallback');

                        dispatch(toggleEventDirty(false));

                        dispatch(clearEventAssociatedData());
                        dispatch(selectEvent({
                            event: convertBalboa3EventToJSEvent(data.event),
                            view: currentView
                        }));

                        dispatch(setMessage({
                            type: 'success',
                            text: getText('Event Saved')
                        }));

                        if (doSubmitFormCallback) {
                            doSubmitFormCallback();
                            dispatch(clearSubmitForm());
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

            radios[RADIOS.services.LOAD_JOB_AGREEMENT] = {
                key() {
                    const {
                        event,
                        speakerInfo,
                        jobBoard
                    } = this.props;

                    let eid = '';

                    if(event.modifiedEvent) {
                        eid = event.modifiedEvent.get('eid');
                    } else if(jobBoard.selectedJob) {
                        eid = jobBoard.selectedJob.jobSummary.get('event_id');
                    }

                    return `${speakerInfo.get('selectedSpeaker').get('sid')}:${eid}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateJobAgreement(data));
                    },
                    failed(error) {
                        dispatch(hideLoading());
                        // Go back to the job board
                        dispatch(clearSubView());

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));
                    }
                }
            };

            radios[RADIOS.services.LOAD_JOB_EVENT] = {
                key() {
                    const {
                        event,
                        jobBoard
                    } = this.props;

                    let eid = '';

                    if(event.modifiedEvent) {
                        eid = event.modifiedEvent.get('eid');
                    } else if(jobBoard.selectedJob) {
                        eid = jobBoard.selectedJob.jobSummary.get('event_id');
                    }

                    return `${eid}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateJobDetail(data));
                    },
                    failed(error) {
                        dispatch(hideLoading());
                        // Go back to the job board
                        dispatch(clearSubView());

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));
                    }
                }
            };

            radios[RADIOS.services.LOAD_JOB_BOARD] = {
                key() {
                    return RADIOS.services.LOAD_JOB_BOARD;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateJobBoardStore(_.assign({
                            lastUpdated: new Date()
                        }, data)));
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

            radios[RADIOS.services.LOAD_JOB_MESSAGES] = {
                key() {
                    const {
                        event,
                        jobBoard
                    } = this.props;

                    let eid = '';

                    if(event.modifiedEvent) {
                        eid = event.modifiedEvent.get('eid');
                    } else if(jobBoard.selectedJob) {
                        eid = jobBoard.selectedJob.jobSummary.get('event_id');
                    }

                    return `${eid}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(updateJobMessages(data));
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

            radios[RADIOS.services.SEND_JOB_MESSAGE] = {
                key() {
                    const {
                        event,
                        jobBoard,
                        speakerInfo
                    } = this.props;

                    const selectedSpeaker = speakerInfo.selectedSpeaker;

                    let eid = '';

                    if(event.modifiedEvent) {
                        eid = event.modifiedEvent.get('eid');
                    } else if(jobBoard.selectedJob) {
                        eid = jobBoard.selectedJob.jobSummary.get('event_id');
                    }

                    return `${eid}-${selectedSpeaker.get('sid')}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            event,
                            jobBoard,
                            speakerInfo
                        } = this.props;
                        dispatch(hideLoading());

                        let eid = '';

                        if(event.modifiedEvent) {
                            eid = event.modifiedEvent.get('eid');
                        } else if(jobBoard.selectedJob) {
                            eid = jobBoard.selectedJob.jobSummary.get('event_id');
                        }

                        loadJobMessages({
                            sid: speakerInfo.selectedSpeaker.get('sid'),
                            event_id: eid
                        });
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

            radios[RADIOS.services.GET_SHORT_PROFILE] = {
                key() {
                    const {
                        speakerInfo
                    } = this.props;

                    const selectedSpeaker = speakerInfo.selectedSpeaker;

                    return selectedSpeaker.get('sid');
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            speakerInfo
                        } = this.props;

                        dispatch(hideLoading());

                        dispatch(updateShortProfile({sid: speakerInfo.selectedSpeaker.get('sid'), shortProfile: data}));
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

            radios[RADIOS.services.SEND_JOB_APPLICATION] = {
                key() {
                    const {
                        event,
                        jobBoard,
                        speakerInfo
                    } = this.props;

                    const selectedSpeaker = speakerInfo.selectedSpeaker;

                    let eid = '';

                    if(event.modifiedEvent) {
                        eid = event.modifiedEvent.get('eid');
                    } else if(jobBoard.selectedJob) {
                        eid = jobBoard.selectedJob.jobSummary.get('event_id');
                    }

                    return `${eid}-${selectedSpeaker.get('sid')}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        const {
                            event,
                            jobBoard
                        } = this.props;
                        dispatch(hideLoading());

                        let eid = '';

                        if(event.modifiedEvent) {
                            eid = event.modifiedEvent.get('eid');
                        } else if(jobBoard.selectedJob) {
                            eid = jobBoard.selectedJob.jobSummary.get('event_id');
                        }

                        JobBoardService.calls[RADIOS.services.LOAD_JOB_BOARD]({}, (error, data) => {
                            if(!_.isEmpty(error)) {
                                dispatch(setMessage({
                                    type: 'error',
                                    text: error
                                }));
                            } else {
                                dispatch(toggleViewDirty(false));
                                dispatch(updateJobBoardStore(_.assign({
                                    lastUpdated: new Date()
                                }, data)));

                                const jobs = _.get(data, 'jobs', []);

                                const selectedJob = _.filter(jobs, (job) => {
                                    return (job.event_id.toString() === eid.toString());
                                });

                                if(selectedJob && selectedJob.length && _.has(selectedJob[0], 'event_id')) {
                                    const jobSummary = fromJS(selectedJob[0]);

                                    dispatch(selectJob(jobSummary));
                                    dispatch(setSubView([VIEWS.jobSubViews.JOB_BOARD_VIEW, VIEWS.jobSubViews.JOB_APPLY_CONFIRMATION_VIEW]));
                                }
                            }
                        });
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
         * Configures the Radio Channels we are listening on
         *
         * @returns {object}
         */
        RadioService_Radio_setup() {
            let radios = {};

            radios[RADIOS.stores.LOGIN_SUCCESS] = (sessionData) => {
                _authHandler(sessionData, this);
            };

            radios[RADIOS.stores.VERIFY_DISPLAY_LISTS] = () => {
                _verifyDisplayListsHandler(this);
                _verifyJobBoardHandler(this);
            };

            radios[RADIOS.stores.VERIFY_COMPANY_LISTS] = () => {
                _verifyCompanyListsHandler(this);
            };

            return radios;
        },
        componentWillReceiveProps(nextProps) {
            const {
                auth,
                browser,
                speakerInfo,
                dispatch,
                view
            } = nextProps;

            // If our auth data has changed, then update balboa and our session store
            if (!is(this.props.auth, auth)) {
                if (auth.get('authedUserSession')) {
                    _initializeBalboa(auth.get('authedUserSession').get('balboa'));
                }

                // If we've logged in and there is no display data, then make the request
                if (auth.get('sessionData') && auth.get('sessionData').get('token')) {
                    getDisplayLists();
                }

                if (auth.get('sessionData') && auth.get('sessionData').get('token')) {
                    getCompanyLists();
                }
            }

            if(auth.get('sessionData') && auth.get('sessionData').get('token')
                && !is(this.props.speakerInfo.selectedSpeaker, speakerInfo.selectedSpeaker)) {
                loadJobBoard();
            }

            // detect keyboard up
            const currentBrowser = this.props.browser;

            if(!is(currentBrowser, browser)) {
                if(!view.keyboardActive && currentBrowser.height && (currentBrowser.height - browser.height) >= 50) {
                    dispatch(toggleKeyboardActive(true));
                } else if(view.keyboardActive && (currentBrowser.height - browser.height) < -50) {
                    dispatch(toggleKeyboardActive(false));
                }
            }
        },
        /**
         * Triggers after render() and the component has made it to the DOM
         */
        componentDidMount() {
            const {
                auth,
                dispatch
            } = this.props;
            let sessionData = auth.get('sessionData');
            let push = auth.get('push');

            // Initialize it with the base URL for now so Forgot Password can still work
            _initializeBalboa({});

            if (sessionData && sessionData.get('token')) {
                _initializeBalboa(sessionData.get('balboa'));
                renewToken(sessionData);
            }
            else {
                dispatch(hideLoading());
            }

            // hide the splash screen if we are all visually loaded
            if (navigator && navigator.splashscreen && _.isFunction(navigator.splashscreen.hide)) {
                navigator.splashscreen.hide();

            }
        },

        componentDidUpdate(prevProps) {
            const currentEvent = this.props.event;
            const prevEvent = prevProps.event;

            // This is here instead of willReceiveProps because the LOAD_EVENT will trigger the RadioService
            // and that uses this.props, which isn't populated yet.

            let eventsDiffer = !is(prevEvent, currentEvent) && !is(prevEvent.get('selectedEvent'), currentEvent.get('selectedEvent'));

            if (eventsDiffer) {
                let currentEid = currentEvent.get('selectedEvent') &&
                    currentEvent.get('selectedEvent').get('eid') &&
                    currentEvent.get('selectedEvent').get('eid').toString();
                let prevEid = prevEvent.get('selectedEvent') &&
                    prevEvent.get('selectedEvent').get('eid') &&
                    prevEvent.get('selectedEvent').get('eid').toString();


                if ((currentEid && (currentEid !== prevEid))
                    || (currentEvent.get('selectedEvent') && currentEvent.get('selectedEvent').size === 1)) {
                    // Load the event from the service
                    radio(RADIOS.services.LOAD_EVENT).broadcast({
                        eid: currentEid
                    });
                }
            }
        },
        /**
         * Builds the HTML/DOM to be rendered to the screen
         *
         * @returns {XML}
         */
        render() {
            const {
                loading
            } = this.props;

            return <MuiThemeProvider muiTheme={ThemeOverride}>
                <div style={{
                    height: '100%',
                    minHeight: '100%'
                }}>
                    <div className='loading-screen'>
                        {(loading && (loading.show) ? <LoadingScreen/> : null)}
                    </div>

                    {_determineView(this)}

                    {(hasPush() ? <PushManager/> : null)}
                </div>
            </MuiThemeProvider>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export default MainViewFactory;