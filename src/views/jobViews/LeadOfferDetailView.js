/**
 * Generates a LeadOfferDetailView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LeadOfferDetailViewFactory = (spec = {}) => {

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

    const OFFER_STATUS = require('../../enums/OFFER_STATUS').default;
    const VIEWS = require('../../enums/VIEWS').default;

    // Factories
    const {DisplayFieldFactory} = require('../../components/DisplayField');
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {JobInfoCardFactory} = require('../../components/cards/JobInfoCard');
    const {SectionHeaderFactory} = require('../../components/SectionHeader');
    const {MeetingNotesFactory} = require('../../components/MeetingNotes');
    const {ActionDescriptionFactory} = require('../../components/ActionDescription');
    const {JobButtonFactory} = require('../../components/JobButton');
    const FlatButton = require('material-ui/FlatButton').default;
    const {IconLabel} = require('../../components/IconLabel');
    const Chip = require('material-ui/Chip').default;
    const Avatar = require('material-ui/Avatar').default;
    const {MessageContainerFactory} = require('../../components/messages/MessageContainer');
    const {JobOfferSectionFactory} = require('../../components/JobOfferSection');

    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        MessageActionsFactory,
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
        getBuyerName,
        getCompanyName,
        getEventDate,
        getLedgerData,
        getMyInfo,
        getOfferEventStatus,
        getOfferStatusIndexByJob,
        getOfferStatusIndexByStatus,
        loadJobAgreement,
        loadJobEvent
    } = JobBoardActionsFactory();
    const {
        setMessage
    } = MessageActionsFactory();
    const {
        addSubView
    } = NavActionsFactory();
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions
    } = ViewActionsFactory({});
    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});
    const SectionHeader = SectionHeaderFactory({});
    const MeetingNotes = MeetingNotesFactory({});
    const JobOfferSection = JobOfferSectionFactory({});
    const JobButton = JobButtonFactory({});
    const ActionDescription = ActionDescriptionFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    const JobInfoCard = JobInfoCardFactory();
    const FormLoading = FormLoadingFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let buildStepContent = undefined;

    buildStepContent = (offerStatus) => {
        const sharedDisplayText = getText('An offer is a binding contract between you and the buyer for the service you will provide and the payment they will make.');

        const styles = {
            chip: {
                margin: 4,
            },
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
            },
        };

        const buildChip = (label) => {
            return <Chip backgroundColor={mainTheme.primaryColor} labelColor={mainTheme.foregroundColor}
                         style={styles.chip}>{label}</Chip>;
        };

        if (!offerStatus || !offerStatus.nowItems || !offerStatus.nowItems.count()) {
            return (
                <div>
                    <MessageContainer type="warning">
                        {getText('Start a conversation with the client to find out what their needs are. Use the message area.')}
                    </MessageContainer>

                    <DisplayField label={offerStatus.areaTitle} displayText={sharedDisplayText}/>
                </div>
            );
        }

        return (
            <div>
                <div>
                    <DisplayField label={getText('now')}>
                        <div style={styles.wrapper}>
                            {offerStatus.nowItems.map((nowItem) => {
                                return <div>{buildChip(nowItem)}</div>;
                            })}
                        </div>
                    </DisplayField>

                    <DisplayField label={getText('next')}>
                        <div style={styles.wrapper}>
                            {offerStatus.nextItems.map((nextItem) => {
                                return <div>{buildChip(nextItem)}</div>;
                            })}
                        </div>
                    </DisplayField>
                </div>

                <DisplayField label={offerStatus.areaTitle} displayText={sharedDisplayText}/>
            </div>
        );
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
        updateHeaderActionsOverride: (inst, props) => {
            let currentProps = props || inst.props;

            const {
                jobBoard,
                speakerInfo,
                dispatch
            } = currentProps;

            const myInfo = getMyInfo({
                jobBoard,
                speakerInfo,
                job: jobBoard.selectedJob
            });

            if (myInfo.n_unread) {
                dispatch(setHeaderActions([
                    {
                        type: 'custom',
                        node: (
                            <div style={{
                                display: 'flex'
                            }}>
                                {IconMap.getButton('message',
                                    {
                                        onClick: (event) => {
                                            stopProp(event);

                                            dispatch(addSubView(VIEWS.jobSubViews.JOB_MESSAGES_VIEW));
                                        },
                                        style: {
                                            paddingRight: 0
                                        }
                                    },
                                    {
                                        color: mainTheme.headerIconColor
                                    })}

                                <div style={{
                                    marginTop: 20,
                                    marginLeft: -15,
                                    marginRight: 15
                                }}>
                                    <Avatar size={20}
                                            backgroundColor={mainTheme.errorBackgroundColor}>{myInfo.n_unread}</Avatar>
                                </div>

                            </div>
                        )
                    }
                ]));
            } else {
                dispatch(setHeaderActions([
                    {
                        onClick: (event) => {
                            stopProp(event);

                            dispatch(addSubView(VIEWS.jobSubViews.JOB_MESSAGES_VIEW));
                        },
                        label: getText('Messages'),
                        iconClass: 'message'
                    }
                ]));
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
        displayName: 'LeadOfferDetailView',
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
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const jobSummary = selectedJob.jobSummary;
            const jobDetail = selectedJob.jobDetail;
            const selectedSpeaker = speakerInfo.selectedSpeaker;

            // TODO: some visual treatment here
            if (!jobDetail)
                return <div></div>;

            const offerStatus = getOfferEventStatus(jobDetail.get('event'), selectedSpeaker.get('sid'));
            const offerAcceptedPlus = getOfferStatusIndexByJob(jobSummary) >= getOfferStatusIndexByStatus(OFFER_STATUS.OFFER_ACCEPTED);

            const chipStyles = {};

            const mpAgreement = _.get(jobDetail.toJS(), ['event', 'MPAgreement', selectedSpeaker.get('sid')]);

            const {
                fees,
                grand_total,
                fee_speaking,
                fee_materials,
                fee_travel
            } = getLedgerData({
                event: jobDetail.get('event').toJS(),
                Displaylists: displayData.get('displayLists').toJS(),
                mp_agreement: mpAgreement
            });

            let btnList = [];

            if (OFFER_STATUS.WAITING_YOU === offerStatus.key) {
                btnList.push(getText("Accept Client's Offer"));
            }

            if (mpAgreement && !mpAgreement.is_accepted) {
                btnList.push(getText("Revise Offer"));
            }

            if (!mpAgreement) {
                btnList.push(getText("Make an Offer"));
            }

            if (mpAgreement) {
                btnList.push(getText("Withdraw Offer"));
            } else {
                btnList.push(getText("Withdraw From Job"));
            }

            return (
                <FormLoading>

                    <JobInfoCard/>

                    <SectionHeader label={offerStatus.status}/>

                    <div>
                        {buildStepContent(offerStatus)}
                    </div>

                    <JobOfferSection/>

                    <MeetingNotes jobDetail={jobDetail}/>

                    {mpAgreement ? <ActionDescription mpAgreement={mpAgreement}/> : null}

                    <JobButton label={getText("Messages")} primary clickHandler={() => {
                        dispatch(addSubView(VIEWS.jobSubViews.JOB_MESSAGES_VIEW));
                    }}/>

                    {_.map(btnList, (btnLabel, i) => {
                        return <JobButton key={`job-btn-${i}`}
                                          label={btnLabel}
                                          primary={i === 0}
                                          secondary={i === 1}
                                          clickHandler={() => {
                                              dispatch(setMessage({
                                                  type: 'tip',
                                                  text: getText("To %1$s, use EventCX on your Computer.", {params: [btnLabel]})
                                              }));
                                          }}
                        />;
                    })}

                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LeadOfferDetailViewFactory }