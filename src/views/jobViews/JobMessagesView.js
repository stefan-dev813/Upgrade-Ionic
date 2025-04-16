/**
 * Generates a JobMessagesView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobMessagesViewFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const moment = require('moment');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {JobMessageCardFactory} = require('../../components/cards/JobMessageCard');

    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});
    const {
        getBuyerName,
        getMessageSpeakerName,
        loadJobEvent,
        loadJobMessages
    } = JobBoardActionsFactory();
    const {
        getText
    } = TranslateActionsFactory({});
    const JobMessageCard = JobMessageCardFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    //---------------------------------
    // Methods
    //---------------------------------

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({
        overrides: {
            getHeaderText() {
                const {
                    jobBoard
                } = this.props;

                const selectedJob = jobBoard.selectedJob;
                const jobDetail = selectedJob.jobDetail;

                // We may have come from PUSH and job details not loaded just yet
                if(!jobDetail)
                    return getText('Messages');

                const buyerName = getBuyerName(jobDetail);

                return getText('Message %1$s', {params: [buyerName]});
            }
        }
    });

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'JobMessagesView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],

        componentDidMount() {
            const {
                event,
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const jobSummary = selectedJob.jobSummary;
            const jobDetail = selectedJob.jobDetail;
            const modifiedEvent = event.modifiedEvent;

            let eid;

            if(modifiedEvent) {
                eid = modifiedEvent.get('eid');
            } else if(jobSummary) {
                eid = jobSummary.get('event_id');
            }

            // We may come here directly via Push
            if(!jobDetail) {
                loadJobEvent({
                    event_id: eid
                });
            }

            loadJobMessages({
                sid: speakerInfo.selectedSpeaker.get('sid'),
                event_id: eid
            });
        },
        /**
         * Invoked immediately after the component's updates are
         * flushed to the DOM.
         *
         * @param prevProps
         * @param prevState
         */
        componentDidUpdate(prevProps, prevState) {
            const prevJobDetail = _.get(prevProps.jobBoard.toJS(), 'selectedJob.jobDetail', undefined);
            const nextJobDetail = _.get(this.props.jobBoard.toJS(), 'selectedJob.jobDetail', undefined);

            if(!prevJobDetail && nextJobDetail) {
                this.updateHeaderText();
            }
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            const {
                dispatch,
                displayData,
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const jobDetail = selectedJob.jobDetail;
            const messages = selectedJob.messages;
            const buyerName = (jobDetail ? getBuyerName(jobDetail.get('event')) : '');

            return (
                <div>
                    {messages ? messages.sort((messageA, messageB) => {
                        let createdA = moment(new Date(_.get(messageA.toJS(), "created_ISO8601", null)));
                        let createdB = moment(new Date(_.get(messageB.toJS(), "created_ISO8601", null)));

                        if(createdA.isBefore(createdB)) {
                            return -1;
                        } else if(createdB.isBefore(createdA)) {
                            return 1;
                        }

                        return 0;
                    }).map((message, i) => {

                        const msg = message.toJS();
                        let is_you = false;
                        let name;
                        if(msg.sender_speaker_id > 0){
                            is_you = true;
                            name = getMessageSpeakerName(displayData, msg.sender_speaker_id);
                        }else{
                            name = buyerName;
                        }

                        return <JobMessageCard key={`message-${i}`}
                                               msg={msg}
                                               senderName={name}
                                               isYou={is_you}
                                               lastItem={i === (messages.count() - 1)}/>;
                    }) : null}
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobMessagesViewFactory }