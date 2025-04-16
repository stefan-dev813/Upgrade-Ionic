/**
 * Generates a ActivityCard component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ActivityCardFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;

    const mainTheme = require('../../theme/mainTheme').default;

    // enums
    const VIEWS = require('../../enums/VIEWS').default;

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const esUtils = require('ES/utils/esUtils');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        selectEvent,
        stopProp
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generateAvatar;
    let _generateSecondaryText;
    let _goToEvent;

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {activity} = inst.props;

        const status = activity.get('st');

        return <Avatar
            backgroundColor={mainTheme.getStatusColor(status)}
        />;
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateSecondaryText = (inst) => {
        const {activity} = inst.props;

        let date = DateTools.convertFromBalboaTrunkTimestamp(activity.get('date'));

        let formattedDate;

        if (date) {
            formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);
        }

        if (activity.get('st') && activity.get('st').length) {
            return getText('became %1$s on %2$s', {
                params: [activity.get('st'), formattedDate]
            });
        }

        return formattedDate;
    };

    /**
     *
     * @param inst
     * @private
     */
    _goToEvent = (inst) => {
        const {activity, dispatch} = inst.props;

        dispatch(selectEvent({
            event: {
                eid: activity.get('eid')
            }
        }));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            activity: PropTypes.object.isRequired
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
        displayName: 'ActivityCard',

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
            const {activity} = this.props;

            return <ListItem
                leftAvatar={_generateAvatar(this)}
                primaryText={activity.get('dsc')}
                secondaryText={_generateSecondaryText(this)}
                onClick={(e) => {
                    stopProp(e);

                    _goToEvent(this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ActivityCardFactory }