/**************************************************************************
 *
 * Imports
 *
 *************************************************************************/
import RADIOS from "../enums/RADIOS";
import {radio} from "react-pubsub-via-radio.js";

/**
 * Generates the Dashboard actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const DashboardActionsFactory = (spec) => {

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/
    let _updateDashboardStore;
    let _loadDashboard;

    /**
     * Handles the updateDashboardStore action
     *
     * @param data
     * @private
     */
    _updateDashboardStore = (data) => {
        return {
            type: RADIOS.stores.DASHBOARD_STORE_UPDATE,
            payload: data
        };
    };

    /**
     * Handles the loadDashboard action
     *
     * @param data
     * @private
     */
    _loadDashboard = (data) => {
        radio(RADIOS.services.LOAD_DASHBOARD).broadcast(data);
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        updateDashboardStore: _updateDashboardStore,
        loadDashboard: _loadDashboard
    };
}
export default DashboardActionsFactory;