/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const OverlayModel = require('./models/OverlayModel').default;

/**
 * Creates an OverlayStore.  Handles all state changes to the overlay
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const OverlayStoreFactory = (spec) => {
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
     * @returns {Record|OverlayModel}
     * @private
     */
    const _initialState = () => {
        return new OverlayModel({});
    };

    /**********************************
     * Methods
     *********************************/

    let _clearStore;
    let _updateStore;

    /**
     *
     * @returns {Record|OverlayModel}
     * @private
     */
    _clearStore = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|OverlayModel} overlay
     * @returns {Record|OverlayModel}
     * @private
     * @see Record
     * @see OverlayModel
     */
    _updateStore = (payload, overlay) => {
        let updatedModel = overlay;

        if (_.has(payload, 'show')) {
            updatedModel = updatedModel.set('show', payload.show);
        }

        if (_.has(payload, 'mode')) {
            updatedModel = updatedModel.set('mode', payload.mode);
        }

        if (_.has(payload, 'onClick')) {
            updatedModel = updatedModel.set('onClick', payload.onClick);
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
     * @param {null|Record|OverlayModel} overlay
     * @param {object} action
     *
     * @returns {Record|OverlayModel}
     */
    return (overlay, action) => {
        if (!overlay) {
            overlay = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.OVERLAY_STORE_UPDATE:
                return _updateStore(payload, overlay);
            case RADIOS.stores.OVERLAY_STORE_CLEAR:
                return _clearStore();
        }

        return overlay;
    };
}

export {
    OverlayStoreFactory
};