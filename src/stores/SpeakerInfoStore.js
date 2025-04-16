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
const GENERAL = require('../enums/GENERAL').default;
const STORAGE = require('../enums/STORAGE').default;

// Services
const {fetchItem, storeItem} = require('../services/LocalStorageService').default();

// Models
const SpeakerInfoModel = require('./models/SpeakerInfoModel').default;

// Utils
const {log} = require('../util/DevTools').default;

/**
 * Creates an SpeakerInfoStore.  Handles all state changes to the speakerInfo
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const SpeakerInfoStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**
     * Loads the last selected speaker from local storage
     * @returns {null|{sid: {string}}}
     * @private
     */
    let _loadSpeakerFromStorage = () => {
        let sid = null;

        try {
            sid = fetchItem(STORAGE.SELECTED_SPEAKER);

            if (sid) {
                return {sid: sid};
            }

            return null;
        } catch (e) {
            return null;
        }
    };

    /**********************************
     * Variables
     *********************************/

    /**
     *
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    const _initialState = () => {
        return new SpeakerInfoModel({
            speakerMode: GENERAL.SINGLE_SPEAKER_MODE,
            selectedSpeaker: fromJS(_loadSpeakerFromStorage())
        });
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _selectSpeaker;
    let _selectSpeakerBySid;
    let _updateShortProfile;
    let _updateStore;

    /**
     *
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    _updateShortProfile = (payload, speakerInfo) => {
        let updatedModel = speakerInfo;
        let speakerList = speakerInfo.speakerList;
        let selectedSpeaker = updatedModel.selectedSpeaker;
        const shortProfile = payload.shortProfile;


        _.map(shortProfile, (profile, sid) => {
            if(sid.toString() === selectedSpeaker.get('sid').toString()) {
                updatedModel = updatedModel.set('selectedSpeaker', selectedSpeaker.set('shortProfile', fromJS(profile)));
            }

            speakerList = speakerList.map((speaker) => {
                if(speaker.get('sid').toString() === sid.toString()) {
                    return speaker.set('shortProfile', fromJS(profile));
                }

                return speaker;
            });
        });

        return updatedModel.set('speakerList', speakerList);
    };

    /**
     *
     * @param {object} payload
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    _updateStore = (payload, speakerInfo) => {
        let updatedModel = speakerInfo;

        if (_.has(payload, 'speakerMode')) {
            updatedModel = updatedModel.set('speakerMode', payload.speakerMode);
        }

        if (_.has(payload, 'selectedSpeaker')) {
            updatedModel = updatedModel.set('selectedSpeaker', fromJS(payload.selectedSpeaker));
        }

        if (_.has(payload, 'speakerList')) {
            updatedModel = updatedModel.set('speakerList', fromJS(payload.speakerList));
        }

        return updatedModel;
    };

    /**
     *
     * @param {object} payload
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    _selectSpeaker = (payload, speakerInfo) => {
        storeItem(STORAGE.SELECTED_SPEAKER, payload.sid);
        return speakerInfo.set('selectedSpeaker', fromJS(payload));
    };

    /**
     *
     * @param {string|number} sid
     * @param {Record|SpeakerInfoModel} speakerInfo
     * @param {Record|AuthModel} auth
     * @param {Record|DisplayDataModel} displayData
     * @returns {Record|SpeakerInfoModel}
     * @private
     */
    _selectSpeakerBySid = (sid, speakerInfo, auth, displayData) => {
        const sessionData = auth.get('sessionData');
        const displayLists = displayData.get('displayLists');

        // find the speaker in both session data and display data
        let perspeaker = {};

        displayLists.get('perspeaker').map((per) => {
            if (per.get('sid').toString() === sid.toString()) {
                perspeaker = per.toJS();
            }
        });

        let session_speaker = sessionData.get('permissions').get(sid.toString());
        if (!_.isNull(session_speaker)) {
            session_speaker = session_speaker.toJS();
        } else {
            session_speaker = {};
        }

        let selectedSpeaker = _.assign({}, session_speaker, perspeaker);

        storeItem(STORAGE.SELECTED_SPEAKER, sid);

        return speakerInfo.set('selectedSpeaker', fromJS(selectedSpeaker));
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
     * @param {null|Record|SpeakerInfoModel} speakerInfo
     * @param {object} action
     *
     * @returns {Record|SpeakerInfoModel}
     */
    return (speakerInfo, action) => {
        if (!speakerInfo) {
            speakerInfo = _initialState();
        }

        const {payload, auth, displayData} = action;

        switch (action.type) {
            case RADIOS.stores.SPEAKER_INFO_STORE_UPDATE:
                return _updateStore(payload, speakerInfo);
            case RADIOS.stores.SPEAKER_INFO_STORE_SELECT_SPEAKER:
                return _selectSpeaker(payload, speakerInfo);
            case RADIOS.stores.SPEAKER_INFO_STORE_SELECT_SPEAKER_BY_SID:
                return _selectSpeakerBySid(payload, speakerInfo, auth, displayData);
            case RADIOS.stores.SPEAKER_INFO_STORE_UPDATE_SHORT_PROFILE:
                return _updateShortProfile(payload, speakerInfo);
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        return speakerInfo;
    };
}

export {
    SpeakerInfoStoreFactory
};