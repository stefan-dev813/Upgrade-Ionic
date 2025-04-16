/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Immutable = require('immutable');
const {fromJS} = Immutable;

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const ViewModel = require('./models/ViewModel').default;

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an ViewStore.  Handles all state changes to the view
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const ViewStoreFactory = (spec) => {
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
     * @returns {Record|ViewModel}
     * @private
     */
    const _initialState = () => {
        return new ViewModel();
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _clearDoSubmitForm;
    let _setDoSubmitForm;
    let _setUndo;
    let _toggleDirty;
    let _toggleKeyboardActive;
    let _updateStore;

    /**
     *
     * @returns {Record|ViewModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _clearDoSubmitForm = (view) => {
        return view.set('doSubmitForm', false).set('doSubmitFormCallback', undefined);
    };

    /**
     *
     * @param {Record} payload
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _setDoSubmitForm = (payload, view) => {
        return view.set('doSubmitForm', true).set('doSubmitFormCallback', payload.callback);
    };

    /**
     *
     * @param {Record} payload
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _setUndo = (payload, view) => {
        const todoView = view.get('todoView');
        if (_.has(todoView, ["get"])) {
            const todoUndo = todoView.get('todoUndo');

            let updatedTodoUndo = todoUndo.set(payload.get('id'), payload);

            return view.set('todoView', todoView.set('todoUndo', updatedTodoUndo));
        }
        return view;
    };

    /**
     *
     * @param {bool} payload
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _toggleDirty = (payload, view) => {
        return view.set('dirty', payload);
    };

    /**
     *
     * @param {bool} payload
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _toggleKeyboardActive = (payload, view) => {
        return view.set('keyboardActive', payload);
    };

    /**
     *
     * @param {object} payload
     * @param {Record|ViewModel} view
     * @returns {Record|ViewModel}
     * @private
     */
    _updateStore = (payload, view) => {
        let updatedModel = view;

        if (_.has(payload, 'dirty')) {
            updatedModel = updatedModel.set('dirty', payload.dirty);
        }

        if (_.has(payload, 'actions')) {
            updatedModel = updatedModel.set('actions', fromJS(payload.actions));
        }

        if(_.has(payload, 'headerText')) {
            updatedModel = updatedModel.set('headerText', payload.headerText);
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
     * @param {null|Record|ViewModel} view
     * @param {object} action
     *
     * @returns {Record|ViewModel}
     */
    return (view, action) => {
        if (!view) {
            view = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.VIEW_STORE_CLEAR_SUBMIT_FORM:
                return _clearDoSubmitForm(view);
            case RADIOS.stores.CLEAR_EVENT_DATA:
                return _toggleDirty(false, view);
            case RADIOS.stores.VIEW_STORE_DO_SUBMIT_FORM:
                return _setDoSubmitForm(payload, view);
            case RADIOS.stores.VIEW_STORE_UPDATE:
                return _updateStore(payload, view);
            case RADIOS.stores.VIEW_STORE_TODO_SET_UNDO:
                return _setUndo(payload, view);
            case RADIOS.stores.VIEW_STORE_TOGGLE_DIRTY:
                return _toggleDirty(payload, view);
            case RADIOS.stores.VIEW_STORE_TOGGLE_KEYBOARD_ACTIVE:
                return _toggleKeyboardActive(payload, view);
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return view;
    };
}

export {
    ViewStoreFactory
};