/**
 * Creates and ListCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const ListCardFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const {is} = require('immutable');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;
    const IconButton = require('material-ui/IconButton').default;
    const IconMenu = require('material-ui/IconMenu').default;
    const MenuItem = require('material-ui/MenuItem').default;

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Components
    const {MultiLineSecondaryTextFactory} = require('./MultiLineSecondaryText');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utils

    // Actions
    const {
        EventActionsFactory
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

    /**********************************
     * Methods
     *********************************/

    let _buildAvatar;
    let _buildMenu;
    let _buildSecondaryText;

    /**
     *
     * @param inst
     * @returns {null|object}
     * @private
     */
    _buildAvatar = (inst) => {
        const {leftAvatarIcon, leftAvatarText, leftAvatarBackgroundColor} = inst.props;

        let leftAvatarElement;

        if (!leftAvatarIcon && !leftAvatarText)
            return null;

        if (_.isString(leftAvatarText) && leftAvatarText.length) {
            let styleOverride = {};

            if (leftAvatarText.length >= 3) {
                styleOverride['fontSize'] = '10px';
            }

            leftAvatarElement = <Avatar
                style={styleOverride}
                backgroundColor={leftAvatarBackgroundColor}>

                {leftAvatarText}
            </Avatar>;
        }

        if (leftAvatarIcon) {
            if (_.isString(leftAvatarIcon)) {
                leftAvatarElement = <Avatar icon={IconMap.getElement(leftAvatarIcon)}/>;
            } else {
                leftAvatarElement = <Avatar icon={leftAvatarIcon}/>;
            }
        }


        return {
            leftAvatar: leftAvatarElement
        };
    };

    /**
     *
     * @param inst
     * @returns {null|object}
     * @private
     */
    _buildMenu = (inst) => {
        const {menuItems} = inst.props;

        if (!menuItems || !menuItems.length) {
            return null;
        }

        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltip="more"
                tooltipPosition="bottom-left">
                {IconMap.getElement('more-vert')}
            </IconButton>
        );

        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
                {_.map(menuItems, (item, i) => {
                    const {leftIcon, onClick, label} = item;

                    let leftIconElement = leftIcon;

                    if (_.isString(leftIcon)) {
                        leftIconElement = IconMap.getElement(leftIcon);
                    }

                    return <MenuItem
                        key={`menu-item-${i}`}
                        leftIcon={leftIconElement}
                        onClick={(e) => {
                            stopProp(e);

                            if (_.isFunction(onClick)) {
                                onClick(e);
                            }
                        }}>
                        {label}
                    </MenuItem>;
                })}
            </IconMenu>
        );

        return {
            rightIconButton: rightIconMenu
        };
    };

    /**
     *
     * @param inst
     * @returns {null|object}
     * @private
     */
    _buildSecondaryText = (inst) => {
        const {secondaryText} = inst.props;

        // This covers string and element
        let secondaryTextElement = secondaryText;

        if (!secondaryText)
            return null;

        if (_.isArray(secondaryText)) {
            if (!secondaryText.length)
                return null;

            // TODO: allow this to be a more complex object
            secondaryTextElement = <MultiLineSecondaryText
                textItems={secondaryText}
            />;
        }

        return {
            secondaryText: secondaryTextElement
        };
    };

    /**********************************
     * Components
     *********************************/

    const MultiLineSecondaryText = MultiLineSecondaryTextFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            menuItems: PropTypes.arrayOf(PropTypes.shape({
                leftIcon: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.element
                ]).isRequired,
                onClick: PropTypes.func.isRequired,
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.element
                ]).isRequired
            })),
            leftAvatarIcon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element
            ]),
            leftAvatarText: PropTypes.string,
            leftAvatarBackgroundColor: PropTypes.string,
            primaryText: PropTypes.string,
            secondaryText: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.array,
                PropTypes.element
            ])
        },
        additionalComparison(nextProps, nextState, inst) {
            // this handles the extra props in-case nothing else is set to change
            // TODO: optimize this
            // TODO: We should be able to compare the post-omitted property set
            if (is(nextProps, inst.props) === false) {
                return true;
            }

            return false;
        }
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
        displayName: 'ListCard',

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
                primaryText
            } = this.props;

            // some properties will need to be excluded so we'll build an additonal prop map
            const avatarObj = _buildAvatar(this);
            const secondaryTextObj = _buildSecondaryText(this);
            const menuObj = _buildMenu(this);

            const builtProps = _.assign({}, avatarObj, secondaryTextObj, menuObj);

            // throw on any extra props provided that isn't in our propTypes, so they can override ListItem
            // Props directly
            let omitList = ['dispatch'];

            _.each(AutoShouldUpdateMixin.propTypes, (v, k) => {
                omitList.push(k);
            });

            const extraProps = _.omit(this.props, omitList);

            return <ListItem
                primaryText={primaryText}
                innerDivStyle={{
                    borderBottom: '1px solid rgb(224, 224, 224)'
                }}
                {...builtProps}
                {...extraProps}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ListCardFactory }