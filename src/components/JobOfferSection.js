/**
 * Generates a JobOfferSection component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobOfferSectionFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Enums
    const OFFER_STATUS = require('../enums/OFFER_STATUS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Actions
    const {
        JobBoardActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    // Components
    const {DisplayFieldFactory} = require('../components/DisplayField');
    const {SectionHeaderFactory} = require('../components/SectionHeader');
    const {IconLabelFactory} = require('../components/IconLabel');
    const FlatButton = require('material-ui/FlatButton').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        buildLocationString
    } = AddressMixinFactory();

    const {
        getBuyerName,
        getCompanyName,
        getMyInfo,
        getOfferEventStatus,
        getOfferStatusIndexByStatus,
        getEventDate,
        getLedgerData
    } = JobBoardActionsFactory();

    const {
        addSubView
    } = NavActionsFactory();

    const {
        getCurrency,
        getText
    } = TranslateActionsFactory();
    const DisplayField = DisplayFieldFactory({});
    const SectionHeader = SectionHeaderFactory({});
    const IconLabel = IconLabelFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let buildLocation;
    let _determineEventId;

    /**
     *
     * @param jobEvent
     * @param displayData
     * @returns {*}
     */
    buildLocation = (jobEvent, displayData) => {
        let event = jobEvent.toJS();
        let Displaylists = displayData.displayLists.toJS();
        const deliveryMethod = event.deliveryMethod || event.deliverymethod;

        let venue = _.first(event.Venue);
        let event_venue = null;

        if (deliveryMethod === 1 && !_.isEmpty(venue)) {
            event_venue = (
                <div style={{
                    marginTop: '2px',
                    marginBottom: '2px'
                }}>
                    <IconLabel fontSize="12px" color="#777" iconClass='location-on'
                               label={buildLocationString(venue)}/>
                </div>
            );

        } else {
            event_venue = <div>
                {_.map(_.filter(Displaylists && Displaylists.universal && Displaylists.universal.deliverymethods, (dm) => {
                    return dm.id === deliveryMethod;
                }), "description").join(", ")
                }
            </div>;
        }

        return event_venue;
    };

    /**
     *
     * @param inst
     * @returns {string|number|null}
     * @private
     */
    _determineEventId = (inst) => {
        const {
            event,
            jobBoard
        } = inst.props;

        const selectedJob = jobBoard.selectedJob;
        const modifiedEvent = event.modifiedEvent;

        if(modifiedEvent) {
            return modifiedEvent.get('eid');
        }

        if(selectedJob && selectedJob.jobSummary) {
            return selectedJob.jobSummary.get('event_id');
        }

        if(selectedJob && selectedJob.jobDetail) {
            return selectedJob.jobDetail.get('eid') || selectedJob.jobDetail.get('event_id');
        }

        return null;
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
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
        displayName: 'JobOfferSection',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {

            const {
                displayData,
                dispatch,
                event,
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const modifiedEvent = event.modifiedEvent;
            const selectedSpeaker = speakerInfo.selectedSpeaker;
            const jobEvent = modifiedEvent || selectedJob.jobDetail.get('event');
            const myInfo = getMyInfo({
                jobBoard,
                speakerInfo,
                eid: _determineEventId(this)
            });

            const mpAgreement = _.get(jobEvent.toJS(), ['MPAgreement', selectedSpeaker.get('sid')]);

            const {
                fees,
                grand_total,
                fee_speaking,
                fee_materials,
                fee_travel
            } = getLedgerData({
                event: jobEvent.toJS(),
                Displaylists: displayData.get('displayLists').toJS(),
                mp_agreement: mpAgreement
            });

            const offerStatus = getOfferEventStatus(jobEvent, selectedSpeaker.get('sid'));
            const offerAcceptedPlus = getOfferStatusIndexByStatus(offerStatus) >= getOfferStatusIndexByStatus(OFFER_STATUS.OFFER_ACCEPTED);

            return (
                <div>
                    <SectionHeader label={offerAcceptedPlus ? getText('Contract') : getText('Offer')}/>

                    <DisplayField label={getText('Client')}
                                  displayText={offerAcceptedPlus ? getCompanyName(jobEvent) : getBuyerName(jobEvent)}/>

                    <DisplayField label={getText('Event')} displayText={jobEvent.get('organization')}/>

                    <DisplayField label={getText('Date')} displayText={getEventDate(jobEvent)}/>

                    <DisplayField label={getText('Location')}>
                        {buildLocation(jobEvent, displayData, buildLocation)}
                    </DisplayField>

                    <DisplayField label={getText('Contracted Speaking Fee')}
                                  displayText={getCurrency({number: fee_speaking})}/>

                    <DisplayField label={getText('Payout To You')}>
                        <div>
                            <span>{getCurrency({number: grand_total})}</span>
                            <span><FlatButton primary={true} label={getText("view details")} onClick={() => {
                                dispatch(addSubView(VIEWS.jobSubViews.PAYOUT_DETAIL_VIEW));
                            }}/></span>
                        </div>
                    </DisplayField>

                    {mpAgreement ? <DisplayField label={getText('Terms')} displayText={mpAgreement.terms}/> : null}
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobOfferSectionFactory }