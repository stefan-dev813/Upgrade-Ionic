/**
 * Generates a LeadsOffersView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const LeadsOffersViewFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const _ = require('lodash');
    const {
        connect
    } = require('react-redux');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../../util/DevTools').default;
    const DateTools = require('../../util/DateTools').default({});

    // Enums
    const {
        RADIOS,
    } = require('../../enums');

    // Lists
    const {
        LeadOfferListFactory
    } = require('../../components/list');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        JobBoardActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
    } = require('../../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Factories
    //---------------------------------

    // Lists
    const LeadOfferList = LeadOfferListFactory({});

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        updateJobBoardStore,
        loadJobBoard
    } = JobBoardActionsFactory({});
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        },
        propsPriority: [
            'jobBoard',
            'speakerInfo'
        ]
    });

    const ViewMixin = ViewMixinFactory({});

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debugging message
         */
        displayName: 'LeadOfferView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],
        /**
         * Triggers when the component receives a new set of properties.  Refreshes the screen if a new selectedSpeaker
         * is passed in.
         *
         * @param nextProps
         */
        componentWillReceiveProps(nextProps) {
            const {
                speakerInfo
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
                loadJobBoard();
            }
        },
        /**
         * Triggers after the component and all child components render.  Calls to load the dashboard data
         */
        componentDidMount() {
            const {
                jobBoard,
                speakerInfo
            } = this.props;

            if (speakerInfo &&
                speakerInfo.get('selectedSpeaker') &&
                speakerInfo.get('selectedSpeaker').get('sid') && !jobBoard.get('lastUpdated')) {
                loadJobBoard();
            }
        },
        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            return <div>
                <LeadOfferList/>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LeadsOffersViewFactory }