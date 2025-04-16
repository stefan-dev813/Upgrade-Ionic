/**
 * Generates the Service Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const ServiceActionsFactory = (spec) => {

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

    let _deleteService;
    let _extractSelectedService;
    let _saveService;
    let _selectService;

    /**
     *
     * @param data
     * @private
     */
    _deleteService = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_DELETE_SERVICE,
            payload: data
        };
    };

    /**
     *
     * @param event
     * @returns {*}
     * @private
     */
    _extractSelectedService = (event) => {
        return extractSelectedItem(event, 'selectedService', 'Service');
    };

    /**
     *
     * @param service
     * @private
     */
    _saveService = (service) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_SERVICE,
            payload: service
        };
    };

    /**
     *
     * @param data
     * @private
     */
    _selectService = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_SERVICE,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.SERVICE_VIEW
            }
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        deleteService: _deleteService,
        extractSelectedService: _extractSelectedService,
        saveService: _saveService,
        selectService: _selectService
    };
}

export default ServiceActionsFactory;