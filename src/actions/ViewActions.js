/**
 * Generates the View Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const ViewActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Utils
    const {log} = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _clearSubmitForm;
    let _doSubmitForm;
    let _updateViewStore;
    let _toggleKeyboardActive;
    let _toggleViewDirty;
    let _setHeaderActions;
    let _setHeaderText;

    /**
     *
     * @returns {{type: string}}
     * @private
     */
    _clearSubmitForm = () => {
        return {
            type: RADIOS.stores.VIEW_STORE_CLEAR_SUBMIT_FORM
        };
    };

    /**
     *
     * @returns {{type: string, payload: object}}
     * @private
     */
    _doSubmitForm = (payload) => {
        return {
            type: RADIOS.stores.VIEW_STORE_DO_SUBMIT_FORM,
            payload
        };
    };

    /**
     * Handles the updateViewStore action
     *
     * @param data
     * @private
     */
    _updateViewStore = (data) => {
        return {
            type: RADIOS.stores.VIEW_STORE_UPDATE,
            payload: data
        };
    };

    /**
     *
     * @param data
     * @returns {{type: *, payload: *}}
     * @private
     */
    _toggleKeyboardActive = (data) => {
        return {
            type: RADIOS.stores.VIEW_STORE_TOGGLE_KEYBOARD_ACTIVE,
            payload: data
        };
    };

    /**
     * Handles the toggleViewDirty action
     *
     * @param data
     * @private
     */
    _toggleViewDirty = (data) => {
        return {
            type: RADIOS.stores.VIEW_STORE_TOGGLE_DIRTY,
            payload: data
        };
    };

    /**
     * Handles the setHeader action
     *
     * @param actions
     * @private
     */
    _setHeaderActions = (actions) => {
        return {
            type: RADIOS.stores.VIEW_STORE_UPDATE,
            payload: {
                actions: actions
            }
        };
    };

    /**
     *
     * @param headerText
     * @returns {{type: string, payload: {headerText: *}}}
     * @private
     */
    _setHeaderText = (headerText) => {
        return {
            type: RADIOS.stores.VIEW_STORE_UPDATE,
            payload: {
                headerText
            }
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        clearSubmitForm: _clearSubmitForm,
        doSubmitForm: _doSubmitForm,
        updateViewStore: _updateViewStore,
        toggleKeyboardActive: _toggleKeyboardActive,
        toggleViewDirty: _toggleViewDirty,
        setHeaderActions: _setHeaderActions,
        setHeaderText: _setHeaderText
    };
}

export default ViewActionsFactory;