const MUIDrawerFactory = (spec) => {

    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // React
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {fromJS} = require('immutable');

    const _ = require('lodash');

    const {
        connect
    } = require('react-redux');

    // Enums
    const VIEWS = require('../../enums/VIEWS').default;

    // Material UI
    const Drawer = require('material-ui/Drawer').default;
    const MenuItem = require('material-ui/MenuItem').default;
    const {List, ListItem} = require('material-ui/List');
    const Avatar = require('material-ui/Avatar').default;

    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Components
    const {DrawerItemFactory} = require('../DrawerItem');
    const {DrawerHeaderCardFactory} = require('../../components/cards/DrawerHeaderCard');


    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        isEspeakers,
        isSolutionTree
    } = require('../../util/Platform').default;

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        NavActionsFactory
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
        isMarketPlaceEvent,
        stopProp
    } = EventActionsFactory({});
    const {
        getMyInfo
    } = JobBoardActionsFactory();
    const {
        addSubView,
        changeEventView,
        toggleDrawer
    } = NavActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const DrawerHeaderCard = DrawerHeaderCardFactory({});
    const DrawerItem = DrawerItemFactory({});

    /**********************************
     * Methods
     *********************************/

    const _changeView = (view, inst) => {
        const {dispatch} = inst.props;

        dispatch(toggleDrawer(false));

        if(view.id === VIEWS.jobSubViews.JOB_MESSAGES_VIEW.id) {
            dispatch(addSubView(view));
        } else {
            dispatch(changeEventView(view, true));
        }
    };

    const _determineLeftIcon = (navItem, inst) => {
        return IconMap.getElement(navItem.iconClass);
    };

    const _determineLeftAvatar = (navItem, inst) => {
        const {
            event,
            jobBoard,
            speakerInfo
        } = inst.props;

        const myInfo = getMyInfo({
            jobBoard,
            speakerInfo,
            eid: event.modifiedEvent.get('eid')
        });

        if(isMarketPlaceEvent(event.modifiedEvent)
            && navItem.id === VIEWS.jobSubViews.JOB_MESSAGES_VIEW.id
            && myInfo.n_unread > 0) {

            return (
                <div style={{
                    display: 'flex',
                    top: 28,
                    left: 26
                }}>
                    {IconMap.getElement('message',
                        {
                            color: mainTheme.headerIconColor
                        })}

                    <div style={{
                        marginTop: -15,
                        marginLeft: -25,
                    }}>
                        <Avatar size={20}
                                backgroundColor={mainTheme.errorBackgroundColor}>{myInfo.n_unread}</Avatar>
                    </div>

                </div>
            );
        }

        return null;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            staticLayout: PropTypes.bool
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
        displayName: 'MUIDrawer',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getDefaultProps() {
            return {
                staticLayout: false
            };
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                dispatch,
                event,
                nav,
                staticLayout
            } = this.props;

            const showDrawer = nav.get('showDrawer');

            let eventViews = _.clone(VIEWS.eventViews);

            if (isSolutionTree()) {
                eventViews = VIEWS.getSolutionTreeEventViews();
            }

            // if this is a marketplace job, then add in the messages view
            if(isMarketPlaceEvent(event.modifiedEvent)) {
                _.assign(eventViews, _.pick(VIEWS.jobSubViews, ['JOB_MESSAGES_VIEW']));
            } else {
                eventViews = _.omit(eventViews, 'JOB_VIEW');
            }


            if (staticLayout) {
                return (
                    <List>
                        {_.map(_.sortBy(eventViews, [(navItem) => {
                            return navItem.order;
                        }]), (navItem, i) => {
                            return <ListItem
                                key={`event-menu-${i}`}
                                leftIcon={_determineLeftIcon(navItem, this)}
                                primaryText={navItem.label}
                                onClick={(e) => {
                                    stopProp(e);

                                    _changeView(navItem, this);
                                }}
                            />;
                        })}
                    </List>
                );
            }

            return (
                <Drawer open={showDrawer || staticLayout}
                        docked={staticLayout || false}
                        className='mui-drawer'
                        containerStyle={{
                            overflowX: 'hidden'
                        }}
                        onRequestChange={(isOpen) => {
                            dispatch(toggleDrawer(isOpen));
                        }}>

                    <div className='header'>
                        <DrawerHeaderCard theme="drawer"/>
                    </div>

                    {_.map(_.sortBy(eventViews, [(navItem) => {
                        return navItem.order;
                    }]), (navItem, i) => {
                        return <MenuItem
                            key={`event-menu-${i}`}
                            leftIcon={_determineLeftIcon(navItem, this)}
                            leftAvatar={_determineLeftAvatar(navItem, this)}
                            primaryText={navItem.label}
                            onClick={(e) => {
                                stopProp(e);

                                _changeView(navItem, this);
                            }}
                        />;
                    })}

                </Drawer>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MUIDrawerFactory }