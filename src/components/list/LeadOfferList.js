/**
 * Generates a JobList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LeadOfferListFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const moment = require('moment');
    const _ = require('lodash');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const ListItem = require('material-ui/List').ListItem;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        JobBoardActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {LeadOfferCardFactory, MessageCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    const {MessageModel} = require('../../stores/models');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const DateTools = require('../../util/DateTools').default({});

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        getMyInfo,
        isJobOffer,
        sortJobs
    } = JobBoardActionsFactory({});
    const {getText} = TranslateActionsFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    const LeadOfferCard = LeadOfferCardFactory();
    const MessageCard = MessageCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _buildEmptyMessage = undefined;

    _buildEmptyMessage = () => {
        return MessageModel({
            type: 'info',
            text: getText("Once you are on the client's shortlist for an engagement, it will appear here and you can work toward an offer.")
        });
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface / React Component
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'LeadOfferList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {jobBoard, speakerInfo} = this.props;
            const jobList = jobBoard.jobs;
            let filteredList = undefined;
            let sortedList = undefined;

            if(jobList) {
                filteredList = jobList.filter((job) => {
                    return isJobOffer({jobBoard, speakerInfo, job});
                });
            }

            if(filteredList) {
                sortedList = sortJobs(filteredList);
            }

            if(!jobBoard.get('lastUpdated')) {
                return null;
            }

            return <List>
                <SectionHeader label={getText('Leads & Offers')}/>

                {sortedList && sortedList.count() ? sortedList.map((job, i) => {
                    return <div key={`job-${i}`}>
                        <LeadOfferCard
                            job={job}
                            myInfo={_.get(jobBoard.toJS(), ["per_sid", speakerInfo.selectedSpeaker.get('sid'), job.get('event_id')], {})}
                        />

                        <Divider/>
                    </div>;
                }) : <MessageCard message={_buildEmptyMessage()}/>}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LeadOfferListFactory }