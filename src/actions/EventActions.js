/**
 * Generates the Event Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const EventActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const {is, fromJS} = require('immutable');

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Utils
    const {log} = require('../util/DevTools').default;
    const DateTools = require('../util/DateTools').default({});

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _clearEventAssociatedData;
    let _clearEvent;
    let _copyEvent;
    let _deleteEvent;
    let _discardEventChanges;
    let _emailCoworkers;
    let _extractSelectedFile;
    let _extractSelectedItem;
    let _fixCustomFields;
    let _isMarketPlaceEvent;
    let _mergeEventData;
    let _mergeModifiedEvent;
    let _prepareContactsFormData;
    let _prepareCustomFormData;
    let _prepareDetailsFormData;
    let _prepareMiscFormData;
    let _saveEvent;
    let _selectEvent;
    let _stopProp;
    let _toggleEventDirty;
    let _updateEventStore;

    /**
     * Clears all event data from store and resets data on other stores to get app
     * in the correct state
     *
     * @private
     */
    _clearEvent = () => {
        // Multiple stores listen on this
        return {
            type: RADIOS.stores.CLEAR_EVENT_DATA
        };
    };

    /**
     * Clears all event related data; such as Calendar, Dashbaord, and Search.
     *
     * @private
     */
    _clearEventAssociatedData = () => {
        // Multiple stores listen on this
        return {
            type: RADIOS.stores.CLEAR_EVENT_ASSOCIATED_DATA
        };
    };

    /**
     * Makes the service request to copy the event
     *
     * @param {object} data
     * @private
     */
    _copyEvent = (data) => {
        radio(RADIOS.services.COPY_EVENT).broadcast(data);
    };

    /**
     * Makes the service request to delete the event
     *
     * @param {object} data
     * @private
     */
    _deleteEvent = (data) => {
        radio(RADIOS.services.DELETE_EVENT).broadcast(data);
    };

    /**
     * Swaps selectedEvent with modifiedEvent, discarding all modifiedEvent changes
     *
     * @private
     */
    _discardEventChanges = () => {
        return {
            type: RADIOS.stores.EVENT_STORE_DISCARD_EVENT_CHANGES
        };
    };

    /**
     * Makes the service request to email coworkers
     *
     * @param {object} data
     * @private
     */
    _emailCoworkers = (data) => {
        radio(RADIOS.services.EMAIL_COWORKERS).broadcast(data);
    };

    /**
     *
     * @param {Record|EventModel} event
     * @param {string} fileId
     * @returns {null|Record|Map}
     * @private
     */
    _extractSelectedFile = (event, fileId) => {
        let modifiedEvent = event.get('modifiedEvent');

        if (!modifiedEvent) {
            modifiedEvent = event.get('selectedEvent');
        }

        const fileList = modifiedEvent.get('storedfiles');
        let selectedFile = null;

        if (fileId && fileId.length) {
            fileList.map((file) => {
                if (file.get('id') && file.get('id').toString() === fileId.toString()) {
                    selectedFile = file;
                }
            });
        }

        return selectedFile;
    };

    /**
     *
     * @param {Record|EventModel} event
     * @param {string} selectedField
     * @param {string} listField
     * @param {string} identifier
     * @param {object} defaultValue
     * @private
     */
    _extractSelectedItem = (event, selectedField, listField, identifier, defaultValue) => {
        identifier = identifier || 'id';

        let modifiedEvent = event.get('modifiedEvent');

        if (!modifiedEvent) {
            modifiedEvent = event.get('selectedEvent');
        }

        const selectedItem = event.get(selectedField);
        const itemList = modifiedEvent.get(listField);
        let retItem = fromJS(defaultValue) || selectedItem;

        if (selectedItem) {
            itemList.map((item) => {
                if (item.get(identifier)
                    && selectedItem.get(identifier)
                    && is(item.get(identifier).toString(), selectedItem.get(identifier).toString())) {

                    retItem = item;
                }
            });
        }

        return retItem;
    };

    /**
     *
     * @param eventObj
     * @return {*}
     * @private
     */
    _fixCustomFields = (eventObj) => {
        if (_.has(eventObj, ['Customfields', 'contents'])) {
            if (_.isArray(eventObj.Customfields.contents)) {
                eventObj.Customfields.contents = {};
            } else if (_.isObject(eventObj.Customfields.contents)) {
                let sidMap = {};

                _.map(eventObj.Customfields.contents, (sid, key) => {
                    sidMap[key] = {};

                    if (_.isArray(sid)) {
                        _.each(sid, (field, i) => {
                            sidMap[key][i] = field;
                        });
                    } else {
                        sidMap[key] = sid;
                    }
                });

                eventObj.Customfields.contents = sidMap;
            }
        }

        return eventObj;
    };

    _isMarketPlaceEvent = (eventObj) => {
        if(!_.isEmpty(eventObj) && 'toJS' in  eventObj) {
            eventObj = eventObj.toJS();
        }

        return _.get(eventObj, ['flags_as_map', 'marketplace', 'is_set'], false);
    };

    /**
     * Merges given data into the existing selectedEvent.  Often as a result as event/read
     *
     * @param {object} data
     * @private
     */
    _mergeEventData = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_MERGE_EVENT_DATA,
            payload: data
        };
    };

    /**
     * Merges given data into the existing modifiedEvent.  So we can track the changes across screens
     *
     * @param {object} data
     * @private
     */
    _mergeModifiedEvent = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_MERGE_MODIFIED_EVENT,
            payload: data
        };
    };


    /**
     * Prepares the CustomForm data into a hierarchy that can be merged with existing event data
     * @param {object} form
     * @returns {object}
     * @private
     */
    _prepareContactsFormData = (params) => {
        const {
            form,
            inst
        } = params;

        let formData = _.pick(form, ['ccTimezone', 'ccInitiator', 'ccNotes']);
        const {
            ccDate,
            ccTime
        } = form;

        const ccDateTime = inst.mergeDate(ccDate, ccTime);

        if (ccDateTime) {
            formData.ccDateTime = ccDateTime;
        }

        return formData;
    };

    /**
     * Prepares the CustomForm data into a hierarchy that can be merged with existing event data
     * @param {object} params
     * @param {object} params.form
     * @param {Record|SpeakerInfoModel} params.speakerInfo
     * @returns {object}
     * @private
     */
    _prepareCustomFormData = (params) => {
        const {
            form,
            speakerInfo
        } = params;

        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        let contents = {};
        contents[selectedSpeaker.get('sid').toString()] = form;

        let customFields = {
            "Customfields": {
                "contents": contents
            }
        };

        return customFields;
    };

    /**
     * Prepares the DetailForm data into a hierarchy that can be merged with existing event data
     * @param {object} form
     * @returns {object}
     * @private
     */
    _prepareDetailsFormData = (form) => {
        // convert some strings to integers.  Doesn't impact save, but since the original event is an integer it causes
        // a false dirty flag
        if (_.has(form, ['zoomUrl']) && !_.isEmpty(form['zoomUrl']) && !_.startsWith(_.toLower(form['zoomUrl']), 'http://') && !_.startsWith(_.toLower(form['zoomUrl']), 'https://')) { form['zoomUrl'] = ('https://' + form['zoomUrl']); }
        if (_.has(form, ['bureauID'])) { form['bureauID'] = DateTools.parseNum(form['bureauID']); }
        if (_.has(form, ['deliveryMethod'])) { form['deliveryMethod'] = DateTools.parseNum(form['deliveryMethod']); }
        if (_.has(form, ['pd_rep_id'])) { form['pd_rep_id'] = DateTools.parseNum(form['pd_rep_id']); }
        if (_.has(form, ['sales_rep_id'])) { form['sales_rep_id'] = DateTools.parseNum(form['sales_rep_id']); }
        if (_.has(form, ['project_manager_id'])) { form['project_manager_id'] = DateTools.parseNum(form['project_manager_id']); }

        return form;
    };

    /**
     * Prepares the MiscForm data into a hierarchy that can be merged with existing event data
     * @param {Record|EventModel} event
     * @param {object} form
     * @private
     * @returns {object}
     */
    _prepareMiscFormData = (event, form) => {
        const modifiedEvent = event.get('modifiedEvent');

        let data = _.assign({}, {
            nonCSP: !form.nonCSP
        });

        return data;
    };

    /**
     *
     * @param {object} data - Full Event object
     * @private
     */
    _saveEvent = (data) => {
        radio(RADIOS.services.SAVE_EVENT).broadcast({event: data.toJS()});
    };

    /**
     * Handles the selectEvent Action
     *
     * @param data
     * @private
     */
    _selectEvent = (data) => {
        let {event, view, onReturn} = data;

        return {
            type: RADIOS.stores.EVENT_STORE_SELECT_EVENT,
            payload: {
                event,
                view,
                onReturn
            }
        };
    };

    /**
     * Stops an event from default behavior and propagating.
     *
     * @param {object|Event} e
     * @private
     */
    _stopProp = (e) => {
        if (_.has(e, 'preventDefault') && _.isFunction(e.preventDefault)) {
            e.preventDefault();
        }

        if (_.has(e, 'stopImmediatePropagation') && _.isFunction(e.stopImmediatePropagation)) {
            e.stopImmediatePropagation();
        }

        // Mobiscroll is wrapping the event in some goofy proxy so normal access is odd
        try {
            e.preventDefault();
            e.stopImmediatePropagation();
        } catch (err) {

        }
    };

    /**
     *
     * @param {boolean} data
     * @private
     */
    _toggleEventDirty = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_TOGGLE_DIRTY,
            payload: data
        };
    };

    /**
     * Handles the updateEventStore Action
     *
     * @param data
     * @private
     */
    _updateEventStore = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_UPDATE,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        clearEvent: _clearEvent,
        clearEventAssociatedData: _clearEventAssociatedData,
        copyEvent: _copyEvent,
        deleteEvent: _deleteEvent,
        discardEventChanges: _discardEventChanges,
        emailCoworkers: _emailCoworkers,
        extractSelectedItem: _extractSelectedItem,
        extractSelectedFile: _extractSelectedFile,
        fixCustomFields: _fixCustomFields,
        isMarketPlaceEvent: _isMarketPlaceEvent,
        mergeEventData: _mergeEventData,
        mergeModifiedEvent: _mergeModifiedEvent,
        prepareContactsFormData: _prepareContactsFormData,
        prepareCustomFormData: _prepareCustomFormData,
        prepareDetailsFormData: _prepareDetailsFormData,
        prepareMiscFormData: _prepareMiscFormData,
        saveEvent: _saveEvent,
        selectEvent: _selectEvent,
        stopProp: _stopProp,
        toggleEventDirty: _toggleEventDirty,
        updateEventStore: _updateEventStore
    };
}

export default EventActionsFactory;