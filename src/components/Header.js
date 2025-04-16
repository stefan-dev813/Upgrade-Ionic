/**
 * Generates a Header component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const HeaderFactory = (spec) => {
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
    const {
        connect
    } = require('react-redux');

    // Enums
    const BTN = require('../enums/BTN').default;
    const RADIOS = require('../enums/RADIOS').default;

    // Factories
    const {CSSTransistorFactory} = require('../components/CSSTransistor');
    const {
        EventHeaderCardFactory,
        MainHeaderCardFactory,
        SubHeaderCardFactory
    } = require('./cards');

    // Material UI
    const AppBar = require('material-ui/AppBar').default;
    const {Toolbar, ToolbarGroup} = require('material-ui/Toolbar');
    const IconMenu = require('material-ui/IconMenu').default;
    const MenuItem = require('material-ui/MenuItem').default;
    const IconButton = require('material-ui/IconButton').default;

    const IconMap = require('../theme/IconMap');
    const mainTheme = require('../theme/mainTheme').default;

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../mixins');

    // Radio
    const {
        radio
    } = require('react-pubsub-via-radio.js');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        OverlayActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory,
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    const CSSTransistor = CSSTransistorFactory({});

    const EventHeaderCard = EventHeaderCardFactory({});
    const MainHeaderCard = MainHeaderCardFactory({});
    const SubHeaderCard = SubHeaderCardFactory({});


    /**********************************
     * Actions
     *********************************/

    const {
        showExitDirtyConfirmation
    } = DialogActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    const {
        checkForDirty,
        getCurrentSubView,
        popSubView,
        toggleDrawer,
    } = NavActionsFactory({});
    const {
        clearOverlay,
        updateOverlayStore
    } = OverlayActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _backHandler;
    let _determineActionIcon;
    let _determineActionLabel;
    let _determineActions;
    let _determineLabel;
    let _determineNavAction;

    /**
     * Handles the Back navigation
     *
     * @param inst
     * @private
     */
    _backHandler = (inst) => {
        const {
            dispatch,
            nav,
            view
        } = inst.props;

        // clear subView
        let viewDirty = view.get('dirty');

        if (viewDirty) {
            dispatch(showExitDirtyConfirmation({
                onContinue: () => {
                    // We are just leaving a sub view, so only View Dirty is relevant
                    dispatch(toggleViewDirty(false));
                    dispatch(popSubView());
                }
            }));
        }
        else {
            dispatch(popSubView());
        }
    };

    /**
     *
     * @param {object} action
     * @returns {string}
     * @private
     */
    _determineActionIcon = (action) => {
        let iconClass = action.get('iconClass');
        let type = action.get('type');

        if (_.isString(iconClass) && iconClass.length > 1)
            return iconClass;

        if (type === BTN.SUBMIT || type === BTN.SAVE) {
            iconClass = 'check';
        }
        else if (type === BTN.DISCARD) {
            iconClass = 'undo';
        }
        else if (type === BTN.MORE_VERTICAL) {
            iconClass = 'fa-ellipsis-v';
        }
        else if (type === BTN.DELETE) {
            iconClass = 'delete';
        }

        return iconClass;
    };

    /**
     *
     * @param {Record} action
     * @returns {string}
     * @private
     */
    _determineActionLabel = (action) => {
        let label = action.get('label');
        let type = action.get('type');

        if (_.isString(label) && label.length) {
            return label;
        }

        if (type === BTN.SUBMIT || type === BTN.SAVE) {
            label = getText('Save Changes');
        }
        else if (type === BTN.DISCARD) {
            label = getText('Discard Changes');
        }
        else if (type === BTN.DELETE) {
            label = getText('Delete');
        }

        return label;
    };

    /**
     * Determines what action button to display
     *
     * @param {array} actions
     * @returns {*}
     * @private
     */
    _determineActions = (inst, props) => {
        props = props || inst.props;

        const {dispatch, nav, view} = props;

        const actions = view.get('actions');
        const eventView = nav.get('eventView');

        let primaryActions = [];
        let overflowActions = [];
        let totalActions = [];
        let maxActions = 2;

        if (eventView) {
            maxActions = 4;
        }

        actions.map((action, i) => {
            if (actions.size <= maxActions) {
                primaryActions.push(action);
            } else if (i < maxActions - 1) {
                primaryActions.push(action);
            } else {
                overflowActions.push(action);
            }
        });

        primaryActions.map((action) => {
            if(action.get('type') === 'custom') {
                totalActions.push(action.get('node').toJS());
            } else {
                totalActions.push(IconMap.getButton(
                    _determineActionIcon(action),
                    {
                        onClick: (e) => {
                            stopProp(e);

                            if (_.isFunction(action.get('onClick'))) {
                                action.get('onClick')();
                            }
                        }
                    },
                    {
                        color: mainTheme.headerIconColor
                    }
                ));
            }

        });

        if (overflowActions && overflowActions.length) {
            // Add in the overflow
            totalActions.push(
                <IconMenu
                    onRequestChange={(open) => {
                        if (!open) {
                            dispatch(clearOverlay());
                        } else {
                            dispatch(updateOverlayStore({
                                show: true,
                                mode: 'translucent',
                                onClick: (e) => {
                                    stopProp(e);

                                    dispatch(clearOverlay());
                                }
                            }));
                        }
                    }}
                    iconButtonElement={
                        IconMap.getButton('more-vert', {
                            onClick: (e) => {
                                stopProp(e);

                                dispatch(updateOverlayStore({
                                    show: true,
                                    mode: 'translucent',
                                    onClick: (e) => {
                                        stopProp(e);

                                        dispatch(clearOverlay());
                                    }
                                }));
                            }
                        }, {
                            color: mainTheme.headerIconColor
                        })
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                    {overflowActions.map((action, i) => {

                        return <MenuItem
                            key={`action-${i}`}
                            primaryText={_determineActionLabel(action)}
                            leftIcon={IconMap.getElement(_determineActionIcon(action))}
                            onClick={(e) => {
                                stopProp(e);

                                dispatch(clearOverlay());

                                if (_.isFunction(action.get('onClick'))) {
                                    action.get('onClick')();
                                }
                            }}
                        />;
                    })}
                </IconMenu>
            );
        }

        return totalActions;
    };

    /**
     *
     * @param {object} inst - Reference to React component
     * @returns {*}
     * @private
     */
    _determineLabel = (inst) => {
        const {
            nav
        } = inst.props;

        const mainView = nav.get('mainView');
        const eventView = nav.get('eventView');
        const subView = getCurrentSubView(nav);

        if (subView) {
            return <SubHeaderCard/>;
        }

        if (eventView) {
            return <p/>;
        }

        if (mainView) {
            return <MainHeaderCard/>;
        }
    };

    /**
     * Determines what action to display in the navigation section
     *
     * @param inst
     * @returns {null|*}
     * @private
     */
    _determineNavAction = (inst) => {
        const {
            dispatch,
            nav
        } = inst.props;

        // default to true
        const includeDrawer = (inst.props.includeDrawer === undefined) ? true : inst.props.includeDrawer;

        const eventView = nav.get('eventView');
        const subView = getCurrentSubView(nav);
        const onReturn = nav.get('onReturn');

        if (subView) {
            return IconMap.getButton('arrow-back', {
                onClick: (e) => {
                    stopProp(e);

                    _backHandler(inst);
                }
            }, {
                color: mainTheme.headerIconColor
            });
        }

        // this will use the default left icon, which is hamburger
        if (eventView && !subView) {
            let actions = [];

            if (_.isFunction(onReturn)) {
                actions.push(
                    IconMap.getButton('arrow-back', {
                        key: 'nav-action-2',
                        onClick: (e) => {
                            stopProp(e);

                            checkForDirty(_.assign(_.pick(inst.props, ['dispatch', 'event', 'view']), {
                                changeViewCallback: () => {
                                    dispatch(onReturn());
                                }
                            }));
                        }
                    }, {
                        color: mainTheme.headerIconColor
                    })
                );
            }

            if (includeDrawer) {
                actions.push(IconMap.getButton('menu', {
                    key: 'nav-action-1',
                    onClick: (e) => {
                        stopProp(e);

                        radio(RADIOS.ui.OPEN_EVENT_NAV).broadcast();

                        dispatch(toggleDrawer(true));
                    }
                }, {
                    color: mainTheme.headerIconColor
                }));
            }

            return actions;
        }

        // this will tell it to not use any left icon
        return <div style={{width: '48px'}}></div>;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            view: PropTypes.object,
            includeDrawer: PropTypes.bool
        },
        propsPriority: [
            'includeDrawer',
            'nav',
            'view',
            'event'
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
        displayName: 'Header',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                includeDrawer: true
            };
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                dispatch
            } = this.props;

            return (
                <Toolbar style={{
                    justifyContent: 'flex-start'
                }}>
                    <ToolbarGroup firstChild={true}>
                        {_determineNavAction(this)}
                    </ToolbarGroup>

                    <ToolbarGroup style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        overflow: 'hidden',
                        flexBasis: '100%'
                    }}>
                        {_determineLabel(this)}
                    </ToolbarGroup>

                    <ToolbarGroup
                        lastChild={true}
                        style={{
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            flexShrink: 0,
                            minWidth: '100px'
                        }}>
                        {_.map(_determineActions(this), (action, i) => {
                            return <div key={`header-action-${i}`}>{action}</div>;
                        })}
                    </ToolbarGroup>
                </Toolbar>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { HeaderFactory }