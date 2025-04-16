/**
 * Generates the Venue Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const VenueActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Node Modules
    const _ = require('lodash');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _extractSelectedVenue;
    let _saveVenue;

    /**
     *
     * @param {Record|EventModel} event
     * @param {string} venueId
     * @returns {null|Record|Map}
     * @private
     */
    _extractSelectedVenue = (event, venueId) => {
        let modifiedEvent = event.get('modifiedEvent');

        if (!modifiedEvent) {
            modifiedEvent = event.get('selectedEvent');
        }

        const venueList = modifiedEvent.get('Venue');
        let selectedVenue = null;

        if (!_.isEmpty(venueId)) {
            venueList.map((venue) => {
                if (venue.get('id') === venueId) {
                    selectedVenue = venue;
                }
            });
        }

        return selectedVenue;
    };

    /**
     * Adds or Updates a Venue to the existing collection, unpersisted with the server
     * @param {object} venue
     * @private
     */
    _saveVenue = (venue) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_VENUE,
            payload: venue
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        extractSelectedVenue: _extractSelectedVenue,
        saveVenue: _saveVenue
    };
}

export default VenueActionsFactory;