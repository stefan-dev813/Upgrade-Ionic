/**
 * Generates the StageTime Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const StageTimeActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Actions
    const EventActionsFactory = require('./EventActions').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {extractSelectedItem} = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _deleteStageTime;
    let _extractSelectStageTime;
    let _saveStageTime;
    let _selectStageTime;

    /**
     *
     * @param data
     * @private
     */
    _deleteStageTime = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_DELETE_STAGETIME,
            payload: data
        };
    };

    /**
     *
     * @param {Record|EventModel} event
     * @returns {null|Record|StageTimeModel}
     * @private
     */
    _extractSelectStageTime = (event) => {
        return extractSelectedItem(event, 'selectedStageTime', 'Stagetime');
    };

    /**
     * Adds or Updates a StageTime to the existing collection, unpersisted with the server
     * @param {object} stageTime
     * @private
     */
    _saveStageTime = (stageTime) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_STAGETIME,
            payload: stageTime
        };
    };

    /**
     * Updates the store with the selected Stage Time object and navigates to the subview
     *
     * @param {object} data
     * @private
     */
    _selectStageTime = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_STAGETIME,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.STAGE_TIME_VIEW
            }
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        deleteStageTime: _deleteStageTime,
        extractSelectedStageTime: _extractSelectStageTime,
        saveStageTime: _saveStageTime,
        selectStageTime: _selectStageTime
    };
}

export default StageTimeActionsFactory;