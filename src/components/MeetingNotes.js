/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MeetingNotesFactory = (spec = {}) => {
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

    // Components
    const {DisplayFieldFactory} = require('./DisplayField');
    const {MessageContainerFactory} = require('./messages/MessageContainer');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Actions
    const {
        JobBoardActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================
    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});
    //---------------------------------
    // Actions
    //---------------------------------

    const {
        getBuyerName,
        getNotes
    } = JobBoardActionsFactory();

    const {
        getText
    } = TranslateActionsFactory();

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobDetail: PropTypes.object.isRequired
        }
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
        displayName: 'MeetingNotes',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                jobDetail
            } = this.props;

            let notes = getNotes(jobDetail);

            let text_content = _.map(notes, (data) => {
                return _.isEmpty(_.get(data, "value", "").trim()) ? "" : `"${_.get(data, "value", "").trim()}"`;
            }).join("\n\n").trim();

            if(_.isEmpty(text_content))
                return null;

            return (
                <MessageContainer
                    type='note'
                    boxStyle={{
                        padding: 0,

                    }}>
                    <DisplayField label={getText("%1$s's meeting goals:", {
                        params: [
                            getBuyerName(jobDetail.get('event'))
                        ]
                    })}
                                  displayText={text_content}/>
                </MessageContainer>
            );
        }
    });

    return component;
}

export { MeetingNotesFactory }