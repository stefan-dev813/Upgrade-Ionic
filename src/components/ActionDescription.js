/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ActionDescriptionFactory = (spec = {}) => {
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

    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});
    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            mpAgreement: PropTypes.object.isRequired
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
        displayName: 'ActionDescription',
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
                mpAgreement
            } = this.props;

            // TODO: Find a easier way to i18n mixed content

            //no offer pending
            if (!mpAgreement) {
                return (
                    <MessageContainer
                        type='warning'
                        boxStyle={{
                            padding: 0,

                        }}>
                        <DisplayField label={getText("Ready to make an offer?")}>
                            <div>
                                <p>{getText("Once you have all the information you need about the work, use the")}
                                    <span className="btnName">{getText("make offer")}</span>
                                    {getText("button to give the client a firm price and to detail what you will provide for them.")}
                                    <br/>{getText("It is common to have exchanged messages with the client before making a firm offer.")}</p>
                            </div>
                        </DisplayField>

                        <DisplayField label={getText("If the client accepts your offer:")}>
                            <div>
                                &middot; <span>it becomes the contract for this engagement and the client will be able
                                to leave public feedback for you, so impress them from the start!</span>
                                <br/>
                                &middot; <span>we collect 50% of the speaking fee and deposit it (less any fees) in your
                                Stripe account.</span>
                            </div>
                        </DisplayField>
                    </MessageContainer>
                );
            }

            //speaker initiated offer
            if (mpAgreement && !mpAgreement.is_accepted) {
                if (mpAgreement.flags_as_map.initiated_by_speaker.is_set) {
                    return (
                        <MessageContainer
                            type='warning'
                            boxStyle={{
                                padding: 0
                            }}>

                            <DisplayField label={getText('Waiting on the client.')}>
                                <div>
                                    <p>You have made an offer to the client for this job, and now it's in their court. They often have several offers to consider, so be patient.</p>

                                    <p>Use the <span className="btnName">messages</span> area to communicate at a respectful frequency.</p>
                                </div>
                            </DisplayField>

                        </MessageContainer>
                    );
                } else {
                    return (
                        <MessageContainer
                            type='warning'
                            boxStyle={{
                                padding: 0
                            }}>

                            <DisplayField label={getText('Waiting on you.')}>
                                <div>
                                    <p>The client has made you an offer, and it waiting for you to <span className="btnName">accept</span> it or to make a counter offer using the <span className="btnName">revise</span> button.</p>

                                    <p><strong>If you need longer than 1 business day</strong> to make your decision, be courteous and use the <span className="btnName">messages</span> area to let them know when to expect an answer from you.</p>
                                </div>
                            </DisplayField>

                        </MessageContainer>
                    );
                }
            }

            if (mpAgreement && mpAgreement.is_accepted) {
                return (
                    <MessageContainer
                        type='warning'
                        boxStyle={{
                            padding: 0
                        }}>

                        <DisplayField label={getText('The deal is on!')}>
                            <div>
                                <p>{getText("You and the buyer have agreed to terms and you are hired. Exceed the client's expectations to earn a great review that turns into more work.")}</p>
                            </div>
                        </DisplayField>

                    </MessageContainer>
                );
            }
        }
    });

    return component;
}

export { ActionDescriptionFactory }