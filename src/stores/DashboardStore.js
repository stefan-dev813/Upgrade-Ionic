/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const {fromJS} = require('immutable');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const DashboardModel = require('./models/DashboardModel').default;

/**
 * Creates an DashboardStore.  Handles all state changes to the dashboard
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DashboardStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const _initialState = () => {
        return new DashboardModel();
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _updateStore;

    /**
     * @returns {Record|DashboardModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|DashboardModel} dashboard
     * @returns {Record|DashboardModel}
     * @private
     */
    _updateStore = (payload, dashboard) => {
        let updatedModel = dashboard;

        if (_.has(payload, 'actionlist')) {
            updatedModel = updatedModel.set('todoList', fromJS(payload.actionlist));
        }

        if (_.has(payload, 'activity')) {
            updatedModel = updatedModel.set('activity', fromJS(payload.activity));
        }

        if (_.has(payload, 'pipeline')) {
            updatedModel = updatedModel.set('pipeline', fromJS(payload.pipeline));
        }

        if (_.has(payload, 'upcoming')) {
            updatedModel = updatedModel.set('upcoming', fromJS(payload.upcoming));
        }

        if (_.has(payload, 'lastUpdated')) {
            updatedModel = updatedModel.set('lastUpdated', payload.lastUpdated);
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
     * @param {null|Record|DashboardModel} dashboard
     * @param {object} action
     * @return {Record|DashboardModel}
     */
    return (dashboard, action) => {
        if (!dashboard) {
            dashboard = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.DASHBOARD_STORE_UPDATE:
                return _updateStore(payload, dashboard);
            case RADIOS.stores.CLEAR_EVENT_ASSOCIATED_DATA:
            case RADIOS.stores.CLEAR_SPEAKER_DATA:
            case RADIOS.stores.REFRESH_DATA:
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return dashboard;
    };
}

export {
    DashboardStoreFactory
};