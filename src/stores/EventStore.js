/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// Node Modules
const _ = require('lodash');
const Immutable = require('immutable');
const {fromJS, is, Map} = Immutable;

// Enums
const RADIOS = require('../enums/RADIOS').default;

// Models
const EventModel = require('./models/EventModel').default;

// Utils
const {log} = require('../util/DevTools').default;
const DateTools = require('../util/DateTools').default({});

// Actions
const {StoreActionsFactory} = require('../actions');

// Stores
const {ContactStoreFactory} = require('./ContactStore');
const {NoteStoreFactory} = require('./NoteStore');
const {ProductStoreFactory} = require('./ProductStore');
const {ServiceStoreFactory} = require('./ServiceStore');
const {StageTimeStoreFactory} = require('./StageTimeStore');
const {TodoStoreFactory} = require('./TodoStore');
const {VenueStoreFactory} = require('./VenueStore');

/**
 * Creates an EventStore.  Handles all state changes to the event
 * area of the state
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const EventStoreFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {generateAddId} = StoreActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    /**
     *
     * @returns {Record|EventModel}
     * @privatee
     */
    const _initialState = () => {
        return new EventModel();
    };

    /**********************************
     * Methods
     *********************************/

    let _clearData;
    let _deleteListItem;
    let _discardEventChanges;
    let _isCustomFieldsEmpty;
    let _mergeEventData;
    let _mergeModifiedEvent;
    let _selectEvent;
    let _toggleDirty;
    let _updateList;
    let _updateStore;

    /**
     * Reverts the store to initial state.
     *
     * @returns {Record|EventModel}
     * @private
     */
    _clearData = () => {
        return _initialState();
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @param {string} listName
     * @param {string} listIdentifier
     * @returns {Record|EventModel}
     * @private
     */
    _deleteListItem = (payload, event, listName, listIdentifier) => {
        listIdentifier = listIdentifier || 'id';

        const modifiedEvent = event.get('modifiedEvent');
        const list = modifiedEvent.get(listName);

        const filteredList = list.filter((item) => {
            if (item.get(listIdentifier)
                && payload[listIdentifier]
                && item.get(listIdentifier).toString() !== payload[listIdentifier].toString()) {
                return true;
            }

            return false;
        });

        const updatedEvent = modifiedEvent.set(listName, filteredList);

        return event.set('modifiedEvent', updatedEvent);
    };

    /**
     * Replaces modifiedEvent with selectedEvent, discarding all changes done to
     * modifiedEvent
     *
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _discardEventChanges = (event) => {
        return event.set('modifiedEvent', event.get('selectedEvent'));
    };

    /**
     *
     * @param {object} customFields
     * @return {boolean}
     * @private
     */
    _isCustomFieldsEmpty = (customFields) => {
        let isEmpty = true;

        _.map(customFields, (sid) => {
            _.map(sid, (field) => {
                isEmpty = false;
            });
        });

        return isEmpty;
    };

    /**
     * Merges given data into the existing selectedEvent.  Often as a result as event/read
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _mergeEventData = (payload, event) => {
        const selectedEvent = event.get('selectedEvent');

        const updatedEvent = selectedEvent.merge(payload);

        // We want to put another reference to the event in modifiedEvent so we can
        // persist the event edits through multiple screens
        return event.set('selectedEvent', updatedEvent).set('modifiedEvent', updatedEvent);
    };

    /**
     * Merges given data into the existing modifiedEvent.  So we can track the changes across screens
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _mergeModifiedEvent = (payload, event) => {
        const modifiedEvent = event.get('modifiedEvent');
        const selectedEvent = event.get('selectedEvent');
        let updatedEvent;
        let eventDirty;

        if (!modifiedEvent)
            return event;

        updatedEvent = modifiedEvent;

        // convert some strings to integers.  Doesn't impact save, but since the original event is an integer it causes
        // a false dirty flag
        _.each(['eid', 'bureauID', 'deliveryMethod', 'productQtyBoxes', 'depositPercent', 'presentingproductid', 'pd_rep_id', 'sales_rep_id', 'project_manager_id'], (key) => {
            if (_.has(payload, key)) {
                if (_.isString(payload[key])) {
                    payload[key] = DateTools.parseNum(payload[key]);
                }
            }
        });

        if (_.has(payload, 'Customfields')) {
            if (!_isCustomFieldsEmpty(payload['Customfields']['contents'])) {
                const Customfields = updatedEvent.get('Customfields');
                let contents = Customfields.get('contents');

                // contents can be set to a List by default, but it needs to be a Map()
                if (!contents.size)
                    contents = Map();

                updatedEvent = updatedEvent.set('Customfields',
                    Customfields.set('contents',
                        contents.merge(payload['Customfields']['contents'])
                    )
                );
            }
        } else {
            updatedEvent = updatedEvent.merge(fromJS(payload));
        }

        eventDirty = !is(selectedEvent, updatedEvent);

        return event.set('modifiedEvent', updatedEvent).set('dirty', eventDirty);
    };

    /**
     *
     * @param {object} payload
     * @param {object} payload.event
     * @param {Record|EventModel} state
     * @returns {Record|EventModel}
     * @private
     */
    _selectEvent = (payload, state) => {
        const {
            event
        } = payload;

        const selectedEvent = fromJS(event);

        return state.set('selectedEvent', selectedEvent).set('modifiedEvent', selectedEvent);
    };

    /**
     *
     * @param {boolean} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _toggleDirty = (payload, event) => {
        return event.set('dirty', payload);
    };

    /**
     * Generic method for updating a List
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @param {string} listName
     * @returns {Record|EventModel}
     * @private
     */
    _updateList = (payload, event, listName) => {
        const modifiedEvent = event.get('modifiedEvent');
        const list = modifiedEvent.get(listName);

        let updatedList;
        let updateIndex = undefined;
        let mergedItem = null;

        if (payload.id && payload.id.toString() === '0') {
            payload.id = generateAddId();
        }

        // edit
        list.map((item, i) => {
            if (item.get('id') === payload.id) {
                updateIndex = i;
            }
        });

        if (updateIndex !== undefined) {
            mergedItem = list.get(updateIndex).merge(fromJS(payload));
            updatedList = list.set(updateIndex, mergedItem);
        } else {
            updatedList = list.push(fromJS(payload));
        }

        const updatedEvent = event.set('modifiedEvent', modifiedEvent.set(listName, updatedList));

        return updatedEvent;
    };

    /**
     *
     * @param {object} payload
     * @param {Record|EventModel} event
     * @returns {Record|EventModel}
     * @private
     */
    _updateStore = (payload, event) => {
        let updatedModel = event;
        if (_.has(payload, 'selectedEvent')) {
            updatedModel = updatedModel.set('selectedEvent', fromJS(payload.selectedEvent));
        }

        return updatedModel;
    };

    /**********************************
     * Stores
     *********************************/

    const subStoreSpec = {
        deleteListItem: _deleteListItem,
        updateList: _updateList
    };

    const ContactStore = ContactStoreFactory(subStoreSpec);
    const NoteStore = NoteStoreFactory(subStoreSpec);
    const ProductStore = ProductStoreFactory(subStoreSpec);
    const ServiceStore = ServiceStoreFactory(subStoreSpec);
    const StageTimeStore = StageTimeStoreFactory(subStoreSpec);
    const TodoStore = TodoStoreFactory(subStoreSpec);
    const VenueStore = VenueStoreFactory(subStoreSpec);

    const subStoreList = [
        ContactStore,
        NoteStore,
        ProductStore,
        ServiceStore,
        StageTimeStore,
        TodoStore,
        VenueStore
    ];

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    /**
     * Handles all store based radio calls and determines an action to take
     * if any.
     *
     * @param {null|Record|EventModel} event
     * @param {object} action
     *
     * @returns {Record|EventModel}
     */
    return (event, action) => {

        if (!event) {
            event = _initialState();
        }

        const {payload} = action;
        switch (action.type) {
            case RADIOS.stores.EVENT_STORE_DISCARD_EVENT_CHANGES:
                return _discardEventChanges(event);
            case RADIOS.stores.EVENT_STORE_MERGE_EVENT_DATA:
                return _mergeEventData(payload, event);
            case RADIOS.stores.EVENT_STORE_MERGE_MODIFIED_EVENT:
                return _mergeModifiedEvent(payload, event);
            case RADIOS.stores.EVENT_STORE_SELECT_EVENT:
                return _selectEvent(payload, event);
            case RADIOS.stores.EVENT_STORE_TOGGLE_DIRTY:
                return _toggleDirty(payload, event);
            case RADIOS.stores.EVENT_STORE_UPDATE:
                return _updateStore(payload, event);
            case RADIOS.stores.CLEAR_EVENT_DATA:
            case RADIOS.stores.LOGOUT:
                return _clearData();
        }

        _.map(subStoreList, (store) => {
            event = store(event, action);
        });

        return event;
    };
}

export {
    EventStoreFactory
};