/**
 * Generates a CompanyData action
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const CompanyDataActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    // Actions
    const LoadingActionsFactory = require('./LoadingActions').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {updateLoadingStore} = LoadingActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _updateCompanyDataStore;
    let _getCompanyLists;
    let _refreshCompanyData;
    let _verifyCompanyLists;

    /**
     *  Handles the updateCompanyDataStore action
     *
     * @param data
     * @private
     */
    _updateCompanyDataStore = (data) => {
        return {
            type: RADIOS.stores.COMPANY_DATA_STORE_UPDATE,
            payload: data
        };
    };

    /**
     *  Handles the getCompanyList action
     *
     * @private
     */
    _getCompanyLists = () => {
        radio(RADIOS.services.GET_COMPANY_LISTS).broadcast();
    };

    /**
     * Handles the refreshCompanyData action
     *
     * @private
     */
    _refreshCompanyData = (silent) => {
        // Get company lists
        _getCompanyLists();

        // Also need to clear out any current data sets: calendar, search, etc.
        return [
            updateLoadingStore({
                silentRefresh: silent || false
            }),
            {
                type: RADIOS.stores.REFRESH_DATA
            }
        ];
    };

    /**
     * Handles the verifyCompanyLists action
     *
     * @private
     */
    _verifyCompanyLists = () => {
        radio(RADIOS.stores.VERIFY_COMPANY_LISTS).broadcast();
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        updateCompanyDataStore: _updateCompanyDataStore,
        refreshCompanyData: _refreshCompanyData,
        getCompanyLists: _getCompanyLists,
        verifyCompanyLists: _verifyCompanyLists
    };
}

export default CompanyDataActionsFactory;

