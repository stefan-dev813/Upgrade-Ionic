/**
 * Generates a StageTimeList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const StageTimeListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    const MessageModel = require('../../stores/models/MessageModel').default;

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {MessageCardFactory, StageTimeCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});
    const SectionHeader = SectionHeaderFactory({});
    const StageTimeCard = StageTimeCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'StageTimeList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getInitialState() {
            return {};
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {event} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            const stageTimeList = modifiedEvent.get('Stagetime');

            return <List>
                <SectionHeader>{getText('Stagetimes')}</SectionHeader>

                {stageTimeList && stageTimeList.size === 0 ?
                    <MessageCard message={new MessageModel({
                        type: 'info',
                        text: getText('Tap the Add button below to create a new %1$s.', {
                            params: [getText('Stagetime')]
                        })
                    })}/>
                    : null}

                {stageTimeList ? stageTimeList.map((item, i) => {
                    return <div key={`stage-time-${i}`}>
                        <StageTimeCard
                            stageTime={item}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StageTimeListFactory }