/**
 * Generates a UpcomingConfirmedCard component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const UpcomingConfirmedCardFactory = (spec) => {
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

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;
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
        const {item} = inst.props;

        const deliveryMethod = item.get('dm').toString();

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        return <Avatar
            backgroundColor={mainTheme.confirmedColor}
            icon={avIcon}/>;
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateSecondaryText = (inst) => {
        const {item} = inst.props;

        let date = DateTools.convertFromBalboaTrunkTimestamp(item.get('date'));

        let formattedDate;

        if (date) {
            formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);
        }

        if (item.get('vnu') && item.get('vnu').length) {
            return getText('%1$s - %2$s', {
                params: [formattedDate, item.get('vnu')]
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
        const {dispatch, item} = inst.props;

        dispatch(selectEvent({
            event: {
                eid: item.get('eid')
            }
        }));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            item: PropTypes.object.isRequired
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
        displayName: 'UpcomingConfirmedCard',

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
            const {item} = this.props;

            return <ListItem
                leftAvatar={_generateAvatar(this)}
                primaryText={item.get('dsc')}
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

export { UpcomingConfirmedCardFactory }