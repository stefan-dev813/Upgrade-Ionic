/**
 * Generates the SpeakerInfo Actions
 *
 * @param spec
 * @returns {{updateSpeakerInfoStore: *, selectSpeaker: *, selectSpeakerBySid: *, determineMsm: *, clearSpeakerData: *}}
 * @constructor
 */
const SpeakerInfoActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const _ = require('lodash');

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const GENERAL = require('../enums/GENERAL').default;
    const esUtils = require('ES/utils/esUtils');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _clearSpeakerData;
    let _determineMsm;
    let _extractGroupCodeItem;
    let _extractSpeakerProduct;
    let _extractSpeakerService;
    let getSpeakersFromDisplayLists;
    let getFeeRange;
    let loadShortProfile;
    let _selectSpeaker;
    let _selectSpeakerBySid;
    let updateShortProfile;
    let _updateSpeakerInfoStore;

    /**
     * Handles the clearSpeakerDate action
     *
     * @private
     */
    _clearSpeakerData = () => {
        // Will be listened for on multiple stores
        return {
            type: RADIOS.stores.CLEAR_SPEAKER_DATA
        };
    };

    /**
     * Handles the determineMsm action
     *
     * @param speakerInfo
     * @returns {boolean}
     * @private
     */
    _determineMsm = (speakerInfo) => {
        const speakerMode = speakerInfo.get('speakerMode');
        const speakerList = speakerInfo.get('speakerList');

        if (speakerMode === GENERAL.MULTIPLE_SPEAKER_MODE && speakerList && speakerList.size > 1) {
            return true;
        }

        return false;
    };

    /**
     *
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @param {string} groupCode
     * @param {string} listField
     * @returns {Record}
     * @private
     */
    _extractGroupCodeItem = (speakerInfo, groupCode, listField) => {
        if (!speakerInfo) {
            return null;
        }

        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        if (!selectedSpeaker) {
            return null;
        }

        const itemList = selectedSpeaker.get(listField);

        let retItem = null;

        if (itemList && itemList.size) {
            itemList.map((item) => {
                if (!retItem && item.get('groupcode') === groupCode) {
                    retItem = item;
                }
            });
        }

        return retItem;
    };

    /**
     *
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @param {string} groupCode
     * @return {Record}
     * @private
     */
    _extractSpeakerProduct = (speakerInfo, groupCode) => {
        return _extractGroupCodeItem(speakerInfo, groupCode, 'productcodes');
    };

    /**
     *
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @param {string} groupCode
     * @return {Record}
     * @private
     */
    _extractSpeakerService = (speakerInfo, groupCode) => {
        return _extractGroupCodeItem(speakerInfo, groupCode, 'servicecodes');
    };

    getFeeRange = (selectedSpeaker) => {
        const profile = (selectedSpeaker.has('shortProfile') ? selectedSpeaker.get('shortProfile').toJS() : {});

        return _.compact(_.map([profile.fee_low, profile.fee_high], (fee) => {
            return _.isNumber(fee) && !_.isNaN(fee) && (fee >= 0) && (fee < Infinity)
                ? esUtils.format_currency(fee, 0)
                : false;
        }));
    };

    getSpeakersFromDisplayLists = (Displaylists, ...sids) => {
        return _.filter(Displaylists && Displaylists.perspeaker, (spkr) => {
            return _.includes(sids, spkr.sid);
        });
    };

    loadShortProfile = (data) => {
        radio(RADIOS.services.GET_SHORT_PROFILE).broadcast(data);
    };

    /**
     * Handles the selectSpeaker action
     *
     * @param speaker
     * @private
     */
    _selectSpeaker = (speaker) => {
        return {
            type: RADIOS.stores.SPEAKER_INFO_STORE_SELECT_SPEAKER,
            payload: speaker
        };
    };

    /**
     * Handles the selectSpeakerBySid action
     *
     * @param sid
     * @private
     */
    _selectSpeakerBySid = (sid, auth, displayData) => {
        return {
            type: RADIOS.stores.SPEAKER_INFO_STORE_SELECT_SPEAKER_BY_SID,
            payload: sid,
            auth,
            displayData
        };
    };

    updateShortProfile = (data) => {
        return {
            type: RADIOS.stores.SPEAKER_INFO_STORE_UPDATE_SHORT_PROFILE,
            payload: data
        };
    };

    /**
     * Handles the updateSpeakerInfo action
     *
     * @param data
     * @private
     */
    _updateSpeakerInfoStore = (data) => {
        return {
            type: RADIOS.stores.SPEAKER_INFO_STORE_UPDATE,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/
    return {
        clearSpeakerData: _clearSpeakerData,
        determineMsm: _determineMsm,
        extractSpeakerProduct: _extractSpeakerProduct,
        extractSpeakerService: _extractSpeakerService,
        getFeeRange,
        getSpeakersFromDisplayLists,
        loadShortProfile,
        selectSpeaker: _selectSpeaker,
        selectSpeakerBySid: _selectSpeakerBySid,
        updateShortProfile,
        updateSpeakerInfoStore: _updateSpeakerInfoStore
    };
}

export default SpeakerInfoActionsFactory;