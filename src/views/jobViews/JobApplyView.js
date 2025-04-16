/**
 * Generates a JobApplyView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobApplyViewFactory = (spec = {}) => {

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

    // Factories
    const {JobApplyFormFactory} = require('../../forms/JobApplyForm');
    const {FormLoadingFactory} = require('../../components/FormLoading');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        SpeakerInfoActionsFactory,
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
        sendJobApplication
    } = JobBoardActionsFactory();
    const {
        loadShortProfile
    } = SpeakerInfoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    const JobApplyForm = JobApplyFormFactory();
    const FormLoading = FormLoadingFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _submitHandler;

    /**
     * Handles the DetailsForm submission
     *
     * @param {object} form - Form values
     * @param {object} inst
     */
    _submitHandler = (form, inst) => {
        const {
            jobBoard,
            speakerInfo
        } = inst.props;

        let params = {
            eid: jobBoard.selectedJob.jobSummary.get('event_id'),
            sid: speakerInfo.selectedSpeaker.get('sid'),
            content: form,
            agreement: _.get(form, ['agreement'], false)
        };


        sendJobApplication(params);
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        },
        compareState: true
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
        displayName: 'JobApplyView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
            };
        },
        componentDidMount() {
            const {
                speakerInfo
            } = this.props;

            loadShortProfile({
                sid: speakerInfo.selectedSpeaker.get('sid')
            });
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            const {
                jobBoard
            } = this.props;

            return (
                <FormLoading>

                    <JobApplyForm
                        ref="jobApplyForms"
                        onSubmit={(form) => {
                            _submitHandler(form, this);
                        }}/>

                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobApplyViewFactory }