/**
 * Generates a Nav action
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const NavActionsFactory = (spec = {}) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const { List } = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Actions
    const {
        DialogActionsFactory,
        DisplayDataActionsFactory,
        EventActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Factories
     *********************************/

    const {verifyDisplayLists} = DisplayDataActionsFactory({});
    const {clearEvent, toggleEventDirty} = EventActionsFactory({});
    const {showExitDirtyConfirmation} = DialogActionsFactory({});
    const {doSubmitForm, toggleViewDirty} = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _changeEventView;
    let _changeMainView;
    let _addSubView;
    let _checkForDirty;
    let _clearSubView;
    let _getCurrentSubView;
    let _popSubView;
    let _nextEventView;
    let _prevEventView;
    let _resetNavigation;
    let _setSubView;
    let _toggleDrawer;
    let _updateNavStore;

    /**
     * Handles the changeEventView action
     *
     * @param view
     * @private
     */
    _changeEventView = (view, forceRefresh) => {
        let newView = view;

        if (typeof view === 'string') {
            _.map(VIEWS.eventViews, (navItem) => {
                if (navItem.get('id') === view) {
                    newView = navItem;
                }
            });
        }

        verifyDisplayLists();

        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_STORE_UPDATE,
                payload: {
                    eventView: newView,
                    changeStamp: (forceRefresh ? new Date().getTime() : 0)
                }
            }
        ];
    };

    /**
     * Handles the changeMainView action
     *
     * @param view
     * @private
     */
    _changeMainView = (view) => {
        let newView = view;

        if (typeof view === 'string') {
            _.map(VIEWS.mainViews, (navItem) => {
                if (navItem.get('id') === view) {
                    newView = navItem;
                }
            });
        }

        verifyDisplayLists();

        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.CLEAR_EVENT_DATA
            },
            {
                type: RADIOS.stores.NAV_CHANGE_MAIN_VIEW,
                payload: newView
            }
        ];
    };

    /**
     * Handles the addSubView action
     *
     * @param view
     * @private
     */
    _addSubView = (view) => {
        let newView = view;

        if (typeof view === 'string') {
            _.map(VIEWS.subViews, (navItem) => {
                if (navItem.get('id') === view) {
                    newView = navItem;
                }
            });
        }

        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: newView
            }
        ];
    };

    /**
     *
     * @param {object} spec
     * @param {function} spec.dispatch
     * @param {object} spec.event - Immutable Event Model
     * @param {object} spec.view
     * @param {function} spec.changeViewCallback
     * @private
     */
    _checkForDirty = (spec) => {
        const {
            dispatch,
            event,
            view,
            changeViewCallback
        } = spec;

        let viewDirty = view.get('dirty');
        let eventDirty = event.get('dirty');

        if (viewDirty || eventDirty) {
            dispatch(showExitDirtyConfirmation({
                onContinue: () => {
                    // if we are leaving via footer nav, then view and event
                    // dirty flags need to be cleared as we are leaving the
                    // event entirely.

                    dispatch(clearEvent());
                    dispatch(toggleViewDirty(false));
                    dispatch(toggleEventDirty(false));

                    if (_.isFunction(changeViewCallback)) {
                        changeViewCallback();
                    }
                    // Make sure the display list data isn't stale with every navigation change
                    verifyDisplayLists();
                },
                onCancel: () => {
                    // dispatch change to trigger screen save
                    dispatch(doSubmitForm({
                        callback: changeViewCallback
                    }));
                }
            }));
        }
        else {
            if (_.isFunction(changeViewCallback)) {
                changeViewCallback();
            }
        }
    };

    _clearSubView = () => {
        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_CLEAR_SUB_VIEW,
                payload: undefined
            }
        ];
    };

    _getCurrentSubView = (nav) => {
        if(nav.subView && nav.subView.count() > 0) {
            return nav.subView.get(nav.subView.count() - 1);
        }

        return null;
    };

    /**
     *
     * @private
     */
    _popSubView = () => {
        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_POP_SUB_VIEW,
                payload: undefined
            }
        ];
    };

    /**
     *
     * @returns {{type: *}}
     * @private
     */
    _nextEventView = () => {
        return {
            type: RADIOS.stores.NAV_NEXT_EVENT_VIEW
        };
    };

    /**
     *
     * @returns {{type: *}}
     * @private
     */
    _prevEventView = () => {
        return {
            type: RADIOS.stores.NAV_PREV_EVENT_VIEW
        };
    };

    /**
     * Handles the resetNavigation action
     *
     * @private
     */
    _resetNavigation = () => {
        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_STORE_RESET
            }
        ];
    };

    _setSubView = (viewList) => {
        return [
            {
                type: RADIOS.stores.MESSAGE_STORE_CLEAR
            },
            {
                type: RADIOS.stores.NAV_SET_SUB_VIEW,
                payload: List(viewList)
            }
        ];
    };

    /**
     *
     * @param {bool} show
     * @returns {object}
     * @private
     */
    _toggleDrawer = (show) => {
        return {
            type: RADIOS.stores.NAV_TOGGLE_DRAWER,
            payload: show
        };
    };

    /**
     * Handles the updateNavStore action
     *
     * @param data
     * @private
     */
    _updateNavStore = (data) => {
        return {
            type: RADIOS.stores.NAV_STORE_UPDATE,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        changeEventView: _changeEventView,
        changeMainView: _changeMainView,
        addSubView: _addSubView,
        checkForDirty: _checkForDirty,
        clearSubView: _clearSubView,
        getCurrentSubView: _getCurrentSubView,
        popSubView: _popSubView,
        nextEventView: _nextEventView,
        prevEventView: _prevEventView,
        resetNavigation: _resetNavigation,
        setSubView: _setSubView,
        toggleDrawer: _toggleDrawer,
        updateNavStore: _updateNavStore
    };
}

export default NavActionsFactory;