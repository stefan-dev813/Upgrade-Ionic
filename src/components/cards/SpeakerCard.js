/**
 * Creates and SpeakerCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 */
const SpeakerCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Enums
    const VIEWS = require('../../enums/VIEWS').default;

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        NavActionsFactory,
        SpeakerInfoActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});

    const {
        changeMainView
    } = NavActionsFactory({});

    const {
        clearSpeakerData,
        selectSpeakerBySid
    } = SpeakerInfoActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _selectHandler;

    /**
     *
     * @param inst
     * @private
     */
    _selectHandler = (inst) => {
        const {
            auth,
            dispatch,
            displayData,
            speaker
        } = inst.props;

        dispatch(clearSpeakerData());
        dispatch(selectSpeakerBySid(speaker.get('sid'), auth, displayData));
        dispatch(changeMainView(VIEWS.mainViews.CALENDAR_VIEW));
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired,
            speaker: PropTypes.object.isRequired
        },
        propsPriority: [
            'speaker',
            'displayData',
            'auth'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'StageTimeCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                speaker
            } = this.props;

            return <ListCard
                leftAvatarIcon='person'
                primaryText={speaker.get('name_full')}
                secondaryText={speaker.get('sid').toString()}
                onClick={(e) => {
                    stopProp(e);

                    _selectHandler(this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SpeakerCardFactory }