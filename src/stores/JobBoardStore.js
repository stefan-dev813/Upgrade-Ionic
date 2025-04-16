/**
 * Creates an JobBoardStore.  Handles all state changes to the dashboard
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const JobBoardStoreFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const {fromJS} = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Models
    const JobBoardModel = require('./models/JobBoardModel').default;
    const JobModel = require('./models/JobModel').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Variables
    //---------------------------------

    const _initialState = () => {
        return new JobBoardModel();
    };

    //---------------------------------
    // Methods
    //---------------------------------

    let _clearData = undefined;
    let _selectJob = undefined;
    let _updateJobAgreement = undefined;
    let _updateJobDetail = undefined;
    let _updateJobMessages = undefined;
    let _updateStore = undefined;

    /**
     * @returns {Record|JobBoardModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object|Record|Map} payload
     * @param {Record|JobBoardModel} jobBoard
     * @returns {Record|JobBoardModel}
     * @private
     */
    _selectJob = (payload, jobBoard) => {
        return jobBoard.set('selectedJob', JobModel({
            jobSummary: payload
        }));
    };

    _updateJobAgreement = (payload, jobBoard) => {
        if (jobBoard.selectedJob) {
            return jobBoard.set('selectedJob', jobBoard.selectedJob.set('agreement'), fromJS(payload));
        }
        return jobBoard;
    };

    _updateJobDetail = (payload, jobBoard) => {
        if (jobBoard.selectedJob) {
            return jobBoard.set('selectedJob', jobBoard.selectedJob.set('jobDetail', fromJS(payload)));
        }
        return jobBoard;
    };

    _updateJobMessages = (payload, jobBoard) => {
        let updateModel = jobBoard;

        if (jobBoard.selectedJob) {
            updateModel = updateModel.set('selectedJob', jobBoard.selectedJob.set('messages', fromJS(payload.messages)));
        }

        let updateObj = {};
        updateObj[payload.sid] = {};
        updateObj[payload.sid][payload.event_id] = {
            n_unread: 0
        };

        // set our messages to be read
        updateModel = updateModel.set('per_sid', updateModel.per_sid.mergeDeep(updateObj));

        return updateModel;
    };

    /**
     *
     * @param {object} payload
     * @param {Record|JobBoardModel} jobBoard
     * @returns {Record|JobBoardModel}
     * @private
     */
    _updateStore = (payload, jobBoard) => {
        let updatedModel = jobBoard;

        if (_.has(payload, 'sids_connected_to_stripe')) {
            updatedModel = updatedModel.set('sids_connected_to_stripe', fromJS(payload.sids_connected_to_stripe));
        }

        if (_.has(payload, 'per_sid')) {
            updatedModel = updatedModel.set('per_sid', fromJS(payload.per_sid));
        }

        if (_.has(payload, 'jobs')) {
            updatedModel = updatedModel.set('jobs', fromJS(payload.jobs));
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
     * @param {null|Record|JobBoardModel} jobboard
     * @param {object} action
     * @return {Record|JobBoardModel}
     */
    return (jobBoard, action) => {
        if (!jobBoard) {
            jobBoard = _initialState();
        }

        const {payload} = action;

        switch (action.type) {
            case RADIOS.stores.JOB_BOARD_STORE_UPDATE:
                return _updateStore(payload, jobBoard);
            case RADIOS.stores.JOB_BOARD_SELECT_JOB:
                return _selectJob(payload, jobBoard);
            case RADIOS.stores.JOB_BOARD_UPDATE_AGREEMENT:
                return _updateJobAgreement(payload, jobBoard);
            case RADIOS.stores.JOB_BOARD_UPDATE_JOB_DETAIL:
                return _updateJobDetail(payload, jobBoard);
            case RADIOS.stores.JOB_BOARD_UPDATE_JOB_MESSAGES:
                return _updateJobMessages(payload, jobBoard);
            case RADIOS.stores.CLEAR_EVENT_ASSOCIATED_DATA:
            case RADIOS.stores.CLEAR_SPEAKER_DATA:
            case RADIOS.stores.REFRESH_DATA:
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return jobBoard;
    };
}

export {
    JobBoardStoreFactory
};