/**
 * Generates a JobApplyConfirmationView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobApplyConfirmationViewFactory = (spec = {}) => {

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
    const {DisplayFieldFactory} = require('../../components/DisplayField');
    const {MessageContainerFactory} = require('../../components/messages/MessageContainer');
    const FlatButton = require('material-ui/FlatButton').default;
    const Paper = require('material-ui/Paper').default;

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
    } = JobBoardActionsFactory();
    const {
        addSubView,
        setSubView
    } = NavActionsFactory();
    const {
        getText
    } = TranslateActionsFactory({});
    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    //---------------------------------
    // Methods
    //---------------------------------

    let applyClickHandler = undefined;

    applyClickHandler = (dispatch) => {
        dispatch(addSubView(VIEWS.jobSubViews.JOB_APPLY_VIEW));
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

    const ViewMixin = ViewMixinFactory({});

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'JobApplyConfirmationView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],
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

            return (
                <div>
                    <DisplayField label={getText("Good job!")} displayText={getText("You have let the client know you're interested in their work. They will receive your message along with a link to your eSpeakers profile, and they will evaluate you and other candidates to find the right expert for their needs.")}/>

                    <DisplayField label={getText("Keep an eye on your inbox.")}
                                  labelStyle={{fontStyle: "italic"}}
                                  displayText={getText("You may hear back in the next day with further questions or with an offer from them. It is possible you will not get a response, even though we encourage clients to communicate with all applicants at every decision point.")}/>

                    <div style={{
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <Paper style={{
                            margin: 'auto',
                            textAlign: 'center',
                            display: 'inline-block',
                        }} zDepth={2}>
                            <img className="screenshot_shadow" src="img/apply_preview.png" />
                        </Paper>
                    </div>

                    <DisplayField>
                        <div style={{fontStyle: "italic", color: mainTheme.mutedFontColor}}>
                            {getText("Buyer receives email with your photo and link to your profile.")}
                        </div>
                    </DisplayField>

                    <FlatButton primary={true} label={getText("View in Leads & Offers")} onClick={() => {
                        dispatch(setSubView([VIEWS.jobSubViews.LEAD_OFFER_DETAIL_VIEW]));
                    }}/>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobApplyConfirmationViewFactory }