/**
 * Creates an SearchResultCard React Component
 *
 * @constructor
 * @param {object} spec - Collection of named parameters
 *
 * @return {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const SearchResultCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    const _ = require('lodash');

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    const {connect} = require('react-redux');

    // enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;

    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    const {MultiLineSecondaryTextFactory} = require('./MultiLineSecondaryText');

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
        MessageActionsFactory,
        NavActionsFactory
    } = require('../../actions');

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************ª
     * Actions
     *********************************/

    const {
        selectEvent,
        stopProp
    } = EventActionsFactory({});

    const {
        clearMessages
    } = MessageActionsFactory({});

    const {
        checkForDirty
    } = NavActionsFactory({});

    const MultiLineSecondaryText = MultiLineSecondaryTextFactory({});

    /**********************************
     * Methods
     *********************************/

    let _actionEventDetail;
    let _buildLocation;
    let _generateAvatar;
    let _generateSecondaryText;

    /**
     *
     *
     * @param item
     * @private
     */
    _actionEventDetail = (eid, inst) => {
        const {
            dispatch
        } = inst.props;

        checkForDirty(_.assign(_.pick(inst.props, ['dispatch', 'event', 'view']), {
            changeViewCallback: () => {
                if (eid) {
                    dispatch(clearMessages());

                    dispatch(selectEvent({
                        event: {
                            eid
                        }
                    }));
                }
            }
        }));
    };

    /**
     * Generates a single location from multiple parts
     *
     * @param {string} city
     * @param {string} state
     * @param {string} country
     * @returns {string}
     * @private
     */
    _buildLocation = (city, state, country) => {
        let parts = [];

        if (city && state) {
            parts.push(`${city}, ${state}`);
        }
        else if (state) {
            parts.push(state);
        }

        if (country) {
            parts.push(country);
        }

        return parts.join(' ');
    };

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {deliveryMethod, status} = inst.props;

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;
        let bgColor;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        bgColor = mainTheme.getStatusColor(status) || mainTheme[`${status}Color`];

        if(_.includes(['ground', 'flight', 'hotel'], status)) {
            bgColor = mainTheme['travelColor'];

            avIcon = IconMap.getElement(status, {
                style: {
                    color: mainTheme.fontColor,
                    fill: mainTheme.fontColor
                }
            });
        }

        if(status === 'call') {
            bgColor = mainTheme['callColor'];

            avIcon = IconMap.getElement('phone');
        }

        if(status === 'coaching') {
            bgColor = mainTheme['coachingColor'];
        }

        if(status === 'daily') {
            bgColor = mainTheme['dailyColor'];

            avIcon = IconMap.getElement('date-range');
        }

        return <Avatar
            backgroundColor={bgColor}
            icon={avIcon}/>;
    };

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateSecondaryText = (inst) => {
        const {
            formattedDate,
            city,
            state,
            country
        } = inst.props;

        let textItems = [];

        if (formattedDate) {
            textItems.push(formattedDate);
        }

        if (city || state || country) {
            textItems.push(_buildLocation(city, state, country));
        }

        return textItems;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            formattedDate: PropTypes.string,
            status: PropTypes.string.isRequired,
            organization: PropTypes.string.isRequired,
            deliveryMethod: PropTypes.string,
            disabled: PropTypes.bool,
            city: PropTypes.string,
            state: PropTypes.string,
            country: PropTypes.string,
            dataEid: PropTypes.string.isRequired,
            event: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        }
    });

    /******************************************************************************
     *
     * React / Public Interface
     *
     *****************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'SearchResultCard',
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
                formattedDate,
                organization,
                city,
                state,
                country,
                dataEid,
                disabled
            } = this.props;

            return <ListItem
                leftAvatar={_generateAvatar(this)}
                primaryText={organization}
                secondaryText={<MultiLineSecondaryText textItems={_generateSecondaryText(this)}/>}
                style={(disabled) ? {
                        opacity: '0.50'
                    } : null}
                onClick={(e) => {
                    stopProp(e);

                    if (!disabled)
                        _actionEventDetail(dataEid, this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SearchResultCardFactory }