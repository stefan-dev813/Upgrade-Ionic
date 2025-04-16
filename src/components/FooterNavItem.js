/**
 * Generates a FooterNavItem component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const FooterNavItemFactory = (spec) => {

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

    const BottomNavigationItem = require('material-ui/BottomNavigation').BottomNavigationItem;
    const {IconMenu, MenuItem} = require('material-ui/IconMenu');
    const Chip = require('material-ui/Chip').default;
    const Avatar = require('material-ui/Avatar').default;

    const IconMap = require('../theme/IconMap');
    const mainTheme = require('../theme/mainTheme').default;

    // Enums
    const VIEWS = require('../enums/VIEWS').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory
    } = require('../actions');

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
        getTotalUnread
    } = JobBoardActionsFactory();

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            viewItem: PropTypes.object.isRequired,
            iconClass: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            selected: PropTypes.bool,
            style: PropTypes.object,
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.object
            ]),
            speakerInfo: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'FooterNavItem',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                iconClass,
                onClick,
                selected,
                style,
                viewItem,
                label,
                jobBoard,
                speakerInfo
            } = this.props;

            let secondaryText = null;
            const totalUnread = (speakerInfo.selectedSpeaker ? getTotalUnread(jobBoard, speakerInfo.selectedSpeaker.get('sid')) : 0);

            if (viewItem.id === VIEWS.mainViews.JOBS_VIEW.id) {
                let manualStyle = {
                    style: _.assign({}, style, {
                        color: (selected ? mainTheme.footerSelectedIconColr : mainTheme.footerIconColor)
                    })
                };
                return (
                    <BottomNavigationItem
                        style={_.assign({
                            minWidth: '48px'
                        }, style)}
                        icon={<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <IconMenu iconButtonElement={IconMap.getButton(iconClass)}
                                      style={{
                                          marginTop: '-5px'
                                      }}
                                      iconStyle={manualStyle.style}
                                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                      targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                      useLayerForClickAway={true}
                                      width={190}>
                                {_.map(VIEWS.getJobBoardViews(), (navItem, i) => {
                                    secondaryText = null;
                                    // if (navItem.id === VIEWS.jobViews.LEADS_OFFERS_VIEW.id && totalUnread) {
                                    //     secondaryText = <span style={{
                                    //         marginTop: -3,
                                    //         marginBottom: 'auto'
                                    //     }}>
                                    //         <Avatar size={20}
                                    //                 backgroundColor={mainTheme.errorBackgroundColor}>{totalUnread}</Avatar>
                                    //     </span>;
                                    // }

                                    return <MenuItem
                                        key={i}
                                        primaryText={navItem.label}
                                        secondaryText={secondaryText}
                                        onClick={(e) => {
                                            stopProp(e);

                                            onClick(navItem);
                                        }}/>;
                                })}
                            </IconMenu>

                            {(totalUnread) ? <div style={{
                                marginTop: '10px',
                                marginLeft: '-20px'
                            }}>
                                <Avatar size={20}
                                        backgroundColor={mainTheme.errorBackgroundColor}>{totalUnread}</Avatar>
                            </div> : null}

                        </div>}>

                    </BottomNavigationItem>
                );
            }

            return <BottomNavigationItem
                selected={selected}
                style={_.assign({minWidth: '48px'}, style)}
                icon={IconMap.getElement(iconClass)}
                label={label}
                onClick={(e) => {
                    stopProp(e);

                    onClick();
                }}/>;
        }
    });
}

export { FooterNavItemFactory }