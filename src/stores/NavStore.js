/**
 * Creates an NavStore.  Handles all state changes to the nav
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const NavStoreFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const { List } = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Models
    const NavModel = require('./models/NavModel').default;

    // Utils
    const {isSolutionTree} = require('../util/Platform').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    /**
     *
     * @returns {Record|NavModel}
     * @private
     */
    const _initialState = () => {
        return new NavModel({
            mainView: VIEWS.mainViews.CALENDAR_VIEW
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _addSubView;
    let _changeEventView;
    let _changeMainView;
    let _clearSubView;
    let _navigateToEvent;
    let _nextEventView;
    let _popSubView;
    let _prevEventView;
    let _reset;
    let _setSubView;
    let _toggleDrawer;
    let _updateStore;

    /**
     *
     * @param {object} payload
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _addSubView = (payload, nav) => {
        return nav.set('subView', nav.get('subView').push(payload));
    };

    /**
     *
     * @param {object} payload
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _changeEventView = (payload, nav) => {
        return nav.set('eventView', payload);
    };

    /**
     *
     * @param {object} payload
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _changeMainView = (payload) => {
        // We want to clear any event or sub view when you select a new main view
        return _initialState().set('mainView', payload);
    };

    /**
     *
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _clearSubView = (nav) => {
        return nav.set('subView', nav.get('subView').clear());
    };

    /**
     *
     * @param {object|NavModel|Record} payload
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _setSubView = (payload, nav) => {
        return nav.set('subView', List(payload));
    };

    /**
     *
     * @param {object} payload
     * @param {NavItemModel|Record} payload.view
     * @param {function|null} payload.onReturn
     * @param {NavModel|Record} nav
     * @returns {NavModel|Record}
     * @private
     */
    _navigateToEvent = (payload, nav) => {
        let {
            view,
            onReturn
        } = payload;

        // When you save an event we navigate to it again, so this gets overridden so the event view is the previous view
        if (!onReturn && !nav.get('eventView') && nav.get('mainView') !== VIEWS.mainViews.NEW_EVENT_VIEW) {
            onReturn = () => {
                return {
                    type: RADIOS.stores.NAV_STORE_UPDATE,
                    payload: {
                        mainView: nav.get('mainView'),
                        subView: nav.get('subView'),
                        eventView: nav.get('eventView')
                    }
                };
            };
        } else {
            onReturn = nav.get('onReturn');
        }

        return nav.set('mainView', null).set('subView', List()).set('eventView', view).set('onReturn', onReturn);
    };

    /**
     *
     * @param {NavModel|Record} nav
     * @returns {NavModel|Record}
     * @private
     */
    _nextEventView = (nav) => {
        const currentEventView = nav.get('eventView');
        let nextEventView = null;
        let eventViews = VIEWS.eventViews;

        if (isSolutionTree()) {
            eventViews = VIEWS.getSolutionTreeEventViews();
        }

        _.map(eventViews, (view) => {
            if(view.get('order') - currentEventView.get('order') === 1) {
                nextEventView = view;
            } else if (currentEventView.get('order') === _.keys(eventViews).length && view.get('order') === 1) {
                nextEventView = view;
            }

            return view;
        });

        if(nextEventView) {
            return nav.set('eventView', nextEventView);
        }

        return nav;
    };

    /**
     *
     * @param {NavModel|Record} nav
     * @returns {NavModel|Record}
     * @private
     */
    _popSubView = (nav) => {
        return nav.set('subView', nav.get('subView').pop());
    };

    /**
     *
     * @param {NavModel|Record} nav
     * @returns {NavModel|Record}
     * @private
     */
    _prevEventView = (nav) => {
        const currentEventView = nav.get('eventView');
        let prevEventView = null;
        let eventViews = VIEWS.eventViews;

        if (isSolutionTree()) {
            eventViews = VIEWS.getSolutionTreeEventViews();
        }

        _.map(eventViews, (view) => {
            if(view.get('order') - currentEventView.get('order') === -1) {
                prevEventView = view;
            } else if (currentEventView.get('order') === 1 && view.get('order') === _.keys(eventViews).length) {
                prevEventView = view;
            }

            return view;
        });

        if(prevEventView) {
            return nav.set('eventView', prevEventView);
        }

        return nav;
    };

    /**
     *
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _reset = () => {
        return _initialState();
    };

    /**
     *
     * @param {bool} payload
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     */
    _toggleDrawer = (payload, nav) => {
        return nav.set('showDrawer', payload);
    };

    /**
     *
     * @param {object} payload
     * @param {Record|NavModel} nav
     * @returns {Record|NavModel}
     * @private
     * @see Record
     * @see NavModel
     */
    _updateStore = (payload, nav) => {
        let updatedModel = nav;

        if (_.has(payload, 'mainView')) {
            updatedModel = updatedModel.set('mainView', payload.mainView);
        }

        if (_.has(payload, 'eventView')) {
            updatedModel = updatedModel.set('eventView', payload.eventView);
        }

        if (_.has(payload, 'subView')) {
            updatedModel = updatedModel.set('subView', payload.subView);
        }

        if (_.has(payload, 'changeStamp')) {
            updatedModel = updatedModel.set('changeStamp', payload.changeStamp);
        }

        return updatedModel;
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    /**
     * Handles all store based radio calls and determines an action to take
     * if any.
     *
     * @param {null|Record|NavModel} nav
     * @param {object} action
     *
     * @returns {Record|NavModel}
     */
    return (nav, action) => {
        if (!nav) {
            nav = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.NAV_STORE_UPDATE:
                return _updateStore(payload, nav);
            case RADIOS.stores.NAV_CHANGE_EVENT_VIEW:
                return _changeEventView(payload, nav);
            case RADIOS.stores.NAV_CHANGE_MAIN_VIEW:
                return _changeMainView(payload, nav);
            case RADIOS.stores.NAV_SET_SUB_VIEW:
                return _setSubView(payload, nav);
            case RADIOS.stores.NAV_CLEAR_SUB_VIEW:
                return _clearSubView(nav);
            case RADIOS.stores.NAV_ADD_SUB_VIEW:
                return _addSubView(payload, nav);
            case RADIOS.stores.NAV_POP_SUB_VIEW:
                return _popSubView(nav);
            case RADIOS.stores.NAV_NEXT_EVENT_VIEW:
                return _nextEventView(nav);
            case RADIOS.stores.NAV_PREV_EVENT_VIEW:
                return _prevEventView(nav);
            case RADIOS.stores.NAV_TOGGLE_DRAWER:
                return _toggleDrawer(payload, nav);
            case RADIOS.stores.EVENT_STORE_SELECT_EVENT:
                return _navigateToEvent(payload, nav);
            case RADIOS.stores.CLEAR_EVENT_DATA:
            case RADIOS.stores.NAV_STORE_RESET:
            case RADIOS.stores.LOGOUT:
                return _reset();
        }

        return nav;
    };
}

export {
    NavStoreFactory
};