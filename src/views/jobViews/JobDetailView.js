/**
 * Generates a JobDetailView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobDetailViewFactory = (spec = {}) => {

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

    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;
    const VIEWS = require('../../enums/VIEWS').default;

    // Factories
    const RaisedButton = require('material-ui/RaisedButton').default;
    const {ChipperFactory} = require('../../components/Chipper');
    const {DisplayFieldFactory} = require('../../components/DisplayField');
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {JobInfoCardFactory} = require('../../components/cards/JobInfoCard');
    const {MessageContainerFactory} = require('../../components/messages/MessageContainer');
    const {MeetingNotesFactory} = require('../../components/MeetingNotes');

    const MessageModel = require('../../stores/models/MessageModel').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const getEventPresenterTypeText = require('ES/utils/getEventDeliveryMethodText');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
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
        getBudget,
        getBuyerName,
        getCommission,
        getEventDate,
        getNotes,
        getShortListDescription,
        getTopics,
        loadJobAgreement,
        loadJobEvent
    } = JobBoardActionsFactory();
    const {
        addSubView
    } = NavActionsFactory();
    const {
        getText
    } = TranslateActionsFactory({});

    const {
        setHeaderActions
    } = ViewActionsFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    const JobInfoCard = JobInfoCardFactory();
    const FormLoading = FormLoadingFactory({});
    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});
    const MeetingNotes = MeetingNotesFactory({});
    const Chipper = ChipperFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let applyClickHandler = undefined;
    let _getEventType = undefined;
    let _getFormat = undefined;

    applyClickHandler = (dispatch) => {
        dispatch(addSubView(VIEWS.jobSubViews.JOB_APPLY_VIEW));
    };

    _getEventType = (job) => {
        const dm = job.get('deliverymethod');
        const location = job.get('location');
        const dmObj = DELIVERY_METHOD_ICONS[dm];

        if(dmObj) {
            return getText("%1$s in %2$s", {
                params: [dmObj.label, location]
            });
        }

        return location;
    };

    _getFormat = (selectedJob, displayData) => {
        const jobSummary = selectedJob.jobSummary;
        const jobDetail = selectedJob.jobDetail;

        if(!jobDetail)
            return null;

        const audienceSize = jobDetail.get('audienceSize');
        const language = jobDetail.get('event').get('language');
        const DisplayList = displayData.displayLists.toJS();

        let formatStr = getEventPresenterTypeText(_.assign({}, jobSummary.toJS(), jobDetail.toJS(), {
            deliveryMethod: jobSummary.get('deliverymethod')
        }), DisplayList);
        formatStr += ' ';

        if(_.isString(audienceSize) && audienceSize.length > 0) {
            formatStr += ` to ${audienceSize}`;
        }

        formatStr += ' in ';
        if(_.has(DisplayList.universal.languages, language)) {
            formatStr += DisplayList.universal.languages[language];
        } else {
            formatStr += language;
        }

        return formatStr;
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({
        overrides: {
            updateHeaderActions() {
                const {
                    dispatch
                } = this.props;

                let actions = [{
                    iconClass: 'assignment',
                    onClick: () => {
                        applyClickHandler(dispatch);
                    }
                }];

                dispatch(setHeaderActions(actions));
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
        displayName: 'JobDetailView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],
        /**
         * Triggers after the component and all child components render.  Calls to load the dashboard data
         */
        componentDidMount() {
            const {
                jobBoard,
                speakerInfo
            } = this.props;

            loadJobAgreement({
                event_id: jobBoard.selectedJob.jobSummary.get('event_id'),
                speaker_id: speakerInfo.selectedSpeaker.get('sid')
            });

            loadJobEvent({
                event_id: jobBoard.selectedJob.jobSummary.get('event_id')
            });
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
                jobBoard
            } = this.props;

            let selectedJob = jobBoard.selectedJob;
            let jobSummary = selectedJob.jobSummary;
            let jobDetail = selectedJob.jobDetail;
            const topics = jobSummary.get('topics');

            const chipStyles = {
            };

            // TODO: some visual treatment here
            if(!jobDetail)
                return <div></div>;

            let commissionDetails = getCommission({jobDetail, displayData});

            return (
                <FormLoading>

                    <JobInfoCard/>

                    <MessageContainer message={MessageModel({
                        type: 'warning',
                        text: getText('This is a request for proposal from a client. If your skills are a good match, use the Apply Now button below to open a conversation with the client.')
                    })}/>

                    <MeetingNotes jobDetail={jobDetail}/>

                    <DisplayField
                        label={getText('Speaking To:')}
                        displayText={jobSummary.get('event_name')}/>

                    <DisplayField
                        label={getText('Budget:')}
                        displayText={getBudget(jobSummary)}/>

                    <DisplayField
                        label={getText('Event Date:')}
                        displayText={getEventDate(jobSummary)}/>

                    <DisplayField
                        label={getText('Event Type:')}
                        displayText={_getEventType(jobSummary)}/>

                    <DisplayField
                        label={getText('Topic:')}>

                        <Chipper chipLabels={getTopics(jobSummary)}/>
                    </DisplayField>

                    <DisplayField
                        label={getText('Format:')}
                        displayText={_getFormat(selectedJob, displayData)}/>

                    <DisplayField label={getText("%1$s Finder's Fee", {
                            params: commissionDetails.display
                        })}
                        displayText={[commissionDetails.message, getShortListDescription(jobDetail, displayData)]}
                    />

                    <MessageContainer text={getText('Applying to this job opens a conversation with the client, and adds you to their shortlist for the event.')}/>

                    <MessageContainer text={getText('You may apply to up to 3 jobs in a 7-day period, so be picky -- only apply to jobs for which you are an especially good match.')}/>

                    <div style={{
                        padding: '10px',
                        marginBottom: '15px'
                    }}>
                        <RaisedButton label={getText('Apply Now')}
                                      primary={true}
                                      fullWidth={true}
                                      onClick={(e) => {
                                          stopProp(e);
                                          applyClickHandler(dispatch);
                                      }}/>
                    </div>
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobDetailViewFactory }