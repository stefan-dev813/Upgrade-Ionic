/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const FooterMessageInputFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const _ = require('lodash');
    const {
        connect
    } = require('react-redux');

    const IconButton = require('material-ui/IconButton').default;
    const TextField = require('material-ui/TextField').default;
    const IconMap = require('../theme/IconMap');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Actions
    const {
        JobBoardActionsFactory
    } = require('../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        sendJobMessage
    } = JobBoardActionsFactory();

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        },
        compareState: true
    });

    //=========================================================================
    //
    // Public Methods
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'FooterMessageInput',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        getInitialState() {
            return {
                msg: ''
            };
        },
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                msg
            } = this.state;

            const {
                event,
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const selectedSpeaker = speakerInfo.selectedSpeaker;
            const jobSummary = selectedJob.jobSummary;
            const sid = selectedSpeaker.get('sid');
            let eid;

            if(event && event.modifiedEvent) {
                eid = event.modifiedEvent.get('eid');
            } else if(jobSummary) {
                eid = jobSummary.get('event_id');
            }

            return (
                <div>
                    <TextField
                      ref={(input) => {
                        input && input.focus();
                      }}
                      name={"message"}
                      autoFocus
                      multiLine={true}
                      value={msg}
                      style={{
                        width: 'calc(100% - 48px - 10px)'
                      }}
                      onChange={(e, val) => {
                        this.setState({
                            msg: val
                        });
                      }}
                    />
                    <IconButton onClick={(e) => {

                        if(!_.isEmpty(_.trim(msg))) {
                            sendJobMessage({
                                sid,
                                eid,
                                msg: _.trim(msg)
                            });
                            this.setState({
                                msg: ''
                            });
                        }
                    }}>
                        {IconMap.getFormIcon('send')}
                    </IconButton>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { FooterMessageInputFactory }