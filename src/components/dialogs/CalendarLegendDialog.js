/**
 * Generates a CalendarLegendDialog component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const CalendarLegendDialogFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Components
    const Dialog = require('material-ui/Dialog').default;
    const FlatButton = require('material-ui/FlatButton').default;
    const {LegendCardFactory} = require('../cards/LegendCard');

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;

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
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const LegendCard = LegendCardFactory({});

    /**********************************
     * Methods
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            widgetId: PropTypes.string.isRequired,
            showWidget: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({

        /**
         * Used for debug messages
         */
        displayName: 'CalendarLegendDialog',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates HTML/DOM
         *
         * @return {XML}
         */
        render() {
            const {
                widgetId,
                showWidget,
                onClose
            } = this.props;

            const decoratorSize = 10;
            const eventSize = 20;

            const actions = [
                <FlatButton
                    label={getText("Close")}
                    primary={true}
                    onClick={(e) => {
                        stopProp(e);

                        onClose();
                    }}
                />
            ];

            return (
                <Dialog
                    open={showWidget}
                    title={getText("Calendar Legend")}
                    actions={actions}
                    autoScrollBodyContent={true}
                    onRequestClose={() => {
                        onClose();
                    }}>
                    <div style={{
                        paddingTop: '10px'
                    }}>
                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.confirmedColor
                            }}
                            avatarSize={eventSize}
                            primaryText={getText("Confirmed")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.heldColor
                            }}
                            avatarSize={eventSize}
                            primaryText={getText("Held")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.leadColor
                            }}
                            avatarSize={eventSize}
                            primaryText={getText("Lead")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.postponedColor
                            }}
                            avatarSize={eventSize}
                            primaryText={getText("Postponed")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.closedColor
                            }}
                            avatarSize={eventSize}
                            primaryText={getText("Closed")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.travelColor
                            }}
                            avatarSize={decoratorSize}
                            primaryText={getText("Travel")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.dailyColor
                            }}
                            avatarSize={decoratorSize}
                            primaryText={getText("Daily")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.callColor
                            }}
                            avatarSize={decoratorSize}
                            primaryText={getText("Call")}/>

                        <LegendCard
                            avatarStyle={{
                                backgroundColor: mainTheme.coachingColor
                            }}
                            avatarSize={decoratorSize}
                            primaryText={getText("Coaching")}/>
                    </div>
                </Dialog>
            );
        }
    });
}

export { CalendarLegendDialogFactory }