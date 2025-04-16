/**
 * Generates a PushManager component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const PushManagerFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    /* global app, PushNotification */

    // NPM
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        is,
        fromJS
    } = require('immutable');
    const {
        connect
    } = require('react-redux');

    // Material UI
    const Snackbar = require('material-ui/Snackbar').default;

    // Theme
    const mainTheme = require('../theme/mainTheme').default;

    // Enums
    const VIEWS = require('../enums/VIEWS').default;
    const RADIOS = require('../enums/RADIOS').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
        NavActionsFactory,
        PushActionsFactory,
        SpeakerInfoActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    // Services
    const JobBoardService = require('../services/JobBoardService');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        selectEvent,
        stopProp
    } = EventActionsFactory({});
    const {
        isJobLead,
        isJobOffer,
        selectJob,
        updateJobBoardStore
    } = JobBoardActionsFactory();
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});
    const {
        setSubView
    } = NavActionsFactory({});
    const {
        clearNotification,
        notify,
        parseBody,
        register
    } = PushActionsFactory({});
    const {
        clearSpeakerData,
        selectSpeakerBySid
    } = SpeakerInfoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _determineRequestedView;
    let _errorHandler;
    let _goHandler;
    let _goToEvent;
    let _goToJob;
    let _isJobEvent;
    let _notificationHandler;
    let _registrationHandler;
    let _speakerSelected;

    /**
     *
     * @param requestedView
     * @private
     */
    _determineRequestedView = (requestedView) => {
        switch (requestedView) {
            case "services":
                return VIEWS.eventViews.SERVICES_VIEW;
            case "messages":
                return VIEWS.jobSubViews.JOB_MESSAGES_VIEW;
        }

        // If there is no match, just go with existing default processing
        return null;
    };

    /**
     *
     * @param err
     * @param inst
     * @private
     */
    _errorHandler = (err, inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(setMessage({
            type: 'error',
            text: err.message
        }));
        log(`push error: ${err.message}`);
    };

    /**
     *
     * @param inst
     * @private
     */
    _goHandler = (props) => {
        const {
            auth,
            dispatch,
            push,
            speakerInfo
        } = props;
        const sessionData = auth.get('sessionData');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const notification = push.get('notification');
        const additionalData = notification.get('additionalData');
        let requestedSpeaker;
        let requestedView;
        let flags;
        let requestedEvent;

        if(additionalData) {
            requestedEvent = additionalData.get('eid');
            flags = additionalData.get('flags');
            requestedSpeaker = additionalData.get('sid');
            requestedView = additionalData.get('view');
        }

        dispatch(clearNotification());

        if(!_.get(auth.toJS(), 'authedUserSession.is_logged_in', false)) {
            dispatch(setMessage({
                type: 'error',
                text: getText('Please sign in to access your account.')
            }));
            return;
        }

        if(!_.isEmpty(requestedEvent)) {
            _goToEvent({
                dispatch,
                requestedEvent,
                requestedSpeaker,
                requestedView,
                sessionData,
                selectedSpeaker
            });
        } else if(!_.isEmpty(requestedEvent) && _isJobEvent(additionalData)) {
            _goToJob({
                dispatch,
                requestedEvent,
                requestedSpeaker,
                requestedView,
                speakerInfo
            });
        } else if(!_.isEmpty(requestedView)) {
            // TODO: We may some day want to go to a main level view, such as dash or calendar
        }
    };

    _goToEvent = (params = {}) => {
        const {
            dispatch,
            requestedEvent,
            requestedView
        } = params;

        if(_speakerSelected(params)) {
            dispatch(selectEvent({
                event: {
                    eid: requestedEvent.toString()
                },
                views: _determineRequestedView(requestedView)
            }));
        }
    };

    _goToJob = (params = {}) => {
        const {
            dispatch,
            requestedEvent,
            requestedView,
            speakerInfo
        } = params;

        let jobView = _determineRequestedView(requestedView);

        if(_speakerSelected(params)) {
            dispatch(showLoading());

            JobBoardService.calls[RADIOS.services.LOAD_JOB_BOARD]({}, (error, data) => {
                dispatch(hideLoading());

                if(!_.isEmpty(error)) {
                    dispatch(setMessage({
                        type: 'error',
                        text: error
                    }));
                } else {
                    dispatch(updateJobBoardStore(_.assign({
                        lastUpdated: new Date()
                    }, data)));

                    const jobs = _.get(data, 'jobs', []);

                    const selectedJob = _.filter(jobs, (job) => {
                        return (job.event_id.toString() === requestedEvent.toString());
                    });

                    if(selectedJob && selectedJob.length && _.has(selectedJob[0], 'event_id')) {
                        const jobSummary = fromJS(selectedJob[0]);
                        const jobBoard = fromJS(data);

                        let subViewList = [];

                        // determine if this is a lead or offer
                        if(!jobView && isJobLead({jobBoard, speakerInfo, job: jobSummary})) {
                            subViewList.push(VIEWS.jobSubViews.JOB_DETAIL_VIEW);
                        } else if(!jobView && isJobOffer({jobBoard, speakerInfo, job: jobSummary})) {
                            subViewList.push(VIEWS.jobSubViews.LEAD_OFFER_DETAIL_VIEW);
                        } else if(jobView.id === VIEWS.jobSubViews.JOB_MESSAGES_VIEW.id) {
                            subViewList.push(jobView);
                            // subViewList.push(VIEWS.jobSubViews.LEAD_OFFER_DETAIL_VIEW);
                        }

                        dispatch(selectJob(jobSummary, subViewList));
                    }
                }
            });
        }
    };

    /**
     *
     * @param additionalData
     * @returns {boolean}
     * @private
     */
    _isJobEvent = (additionalData) => {
        const {
            flags
        } = additionalData;

        if(_.isEmpty(flags)) {
            return false;
        }

        return (flags & 2) > 0;
    };

    /**
     *
     * @param data
     * @param inst
     * @private
     */
    _notificationHandler = (data, inst) => {
        const {
            dispatch
        } = inst.props;

        let bodyData;
        // log(data);

        if (data && _.has(data, 'additionalData')) {
            bodyData = parseBody(data.additionalData);
        }

        if (bodyData) {
            data.additionalData = _.assign(data.additionalData, bodyData);
        }

        dispatch(notify(data));
    };

    /**
     *
     * @param data
     * @param inst
     * @private
     */
    _registrationHandler = (data, inst) => {
        const {
            dispatch,
            push
        } = inst.props;

        // log(`registration event: ${data.registrationId}`);
        let oldRegId = push.get('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            dispatch(register(data.registrationId));
            // localStorage.setItem('registrationId', data.registrationId);
            // Post registrationId to your app server as the value has changed
        }
    };

    _speakerSelected = (params = {}) => {
        const {
            dispatch,
            requestedSpeaker,
            sessionData,
            selectedSpeaker
        } = params;

        // If there is no sid, then assume we are on the right one?
        if (_.isEmpty(requestedSpeaker)) {
            return true;
        }

        // If we are on the right speaker or we know we can safely change to the right one
        // Then go ahead and update the selected event as well
        if (requestedSpeaker.toString() === selectedSpeaker.get('sid').toString()) {
            return true;
        }

        // check if the speaker also needs to change
        if (requestedSpeaker.toString() !== selectedSpeaker.get('sid').toString() &&
            sessionData.get('permissions').has(requestedSpeaker.toString())) {

            dispatch(clearSpeakerData());
            dispatch(selectSpeakerBySid(requestedSpeaker));

            return true;
        }

        return false;
    };

    /**********************************
     * Components
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            push: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'PushManager',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once immediately after the initial rendering occurs.
         */
        componentDidMount() {
            app.push = PushNotification.init({
                "android": {
                    "senderID": "179304634258",
                    "icon": "ic_stat_name"
                },
                "ios": {
                    "sound": true,
                    "vibration": true,
                    "badge": true
                },
                "windows": {}
            });

            app.push.on('registration', (data) => {
                _registrationHandler(data, this);
            });

            app.push.on('notification', (data) => {
                _notificationHandler(data, this);
            });

            app.push.on('error', (e) => {
                _errorHandler(e, this);
            });
        },

        /**
         * Invoked when a component is receiving new props. This method
         * is not called for the initial render.
         *
         * @param {object} nextProps
         */
        componentWillReceiveProps(nextProps) {
            const currentPush = this.props.push;
            const nextPush = nextProps.push;
            let notification;
            let additionalData;

            // call this.setState if certain props are changed
            if (is(currentPush.get('notification'), nextPush.get('notification')) === false) {
                notification = nextPush.get('notification');

                if (notification) {
                    additionalData = notification.get('additionalData');
                }

                // If this was caught in the background, then we want to open the app and act as if they
                // selected "Go"
                if (additionalData &&
                    additionalData.has('foreground') &&
                    additionalData.get('foreground') === false) {
                    _goHandler(nextProps);
                }
            }
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                dispatch,
                push
            } = this.props;

            let additionalData = null;

            const notification = push.get('notification');

            if (notification) {
                additionalData = notification.get('additionalData');
            }

            let showAction = (additionalData && (additionalData.get('eid') || additionalData.get('jid') || additionalData.get('view')));

            let bgColor = 'white';

            return (
                <div>
                    <div className='push-reg-id'
                         style={{display: 'none'}}>

                        {(push ? push.get('registrationId') : null)}
                    </div>

                    {notification ? <Snackbar
                        id='push-notification'
                        ref='push-notification'
                        open={(additionalData && additionalData.get('foreground'))}
                        onActionTouchTap={(e) => {
                            stopProp(e);

                            _goHandler(this.props);
                        }}
                        onRequestClose={(e) => {
                            dispatch(clearNotification());
                        }}
                        style={{
                            backgroundColor: bgColor,
                            height: 'auto',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                        }}
                        contentStyle={{
                            backgroundColor: bgColor,
                            color: 'black',
                            height: 'auto'
                        }}
                        bodyStyle={{
                            backgroundColor: bgColor,
                            height: 'auto'
                        }}
                        autoHideDuration={7000}
                        action={(showAction ? getText('GO') : getText('OK'))}
                        message={<div>
                            <div style={{
                                color: mainTheme.primaryColor,
                                fontWeight: 'bold',
                                fontSize: '10px'
                            }}>{notification.get('title')}</div>
                            <div className="push-message" style={{
                                lineHeight: 1.5
                            }}>
                                {notification.get('message')}
                            </div>
                        </div>}/> : null}
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { PushManagerFactory }