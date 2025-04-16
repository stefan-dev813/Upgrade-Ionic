/**
 * Provides methods to help build out Venue Forms
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixin
 * @mixes AddressMixin
 */
const VenueMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');

    // Factories

    // Mixins
    const AddressMixinFactory = require('./AddressMixin').default;
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        TranslateActionsFactory,
        VenueActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        getText,
        jed
    } = TranslateActionsFactory({});
    const {
        extractSelectedVenue
    } = VenueActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _findSelectedVenue;
    let _generateTimezoneOptions;
    let _generateVenueData;

    /**
     *
     * @param {string} venueId
     * @param {object} inst
     * @returns {null|Record|Map}
     * @private
     */
    _findSelectedVenue = (venueId, inst) => {
        const {
            event
        } = inst.props;

        return extractSelectedVenue(event, venueId);
    };

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateTimezoneOptions = (inst) => {
        const {
            displayData
        } = inst.props;
        const displayLists = displayData.get('displayLists');

        const universal = displayLists.get('universal');
        const timezones = universal.get('timezones');

        let options = [];

        timezones.map((timezone) => {
            options.push({
                text: timezone,
                value: timezone
            });
        });

        return options;
    };

    /**
     *
     * @param {null|Record|Map} venue
     * @returns {object}
     * @private
     */
    _generateVenueData = (venue) => {
        let data = {
            building: '',
            city: '',
            st: '',
            country: 'US',
            address: '',
            phone: '',
            fax: '',
            zip: '',
            timezone: ''
        };

        if (venue) {
            data = _.pick(venue.toJS(), ['building',
                'city',
                'st',
                'country',
                'address',
                'phone',
                'fax',
                'zip',
                'timezone'
            ]);
        }

        return data;
    };

    /**********************************
     * Factories
     *********************************/

    const AddressMixin = AddressMixinFactory({});

    /**************************************************************************
     *
     * Public Members
     *
     *************************************************************************/

    return _.assign({}, AddressMixin, {
        /**
         * Create a common schema for Venues
         * @returns {object}
         */
        buildVenueSchema(data) {
            return _.assign({}, this.buildAddressSchema(data), {
                building: {
                    name: 'building',
                    label: getText('Name'),
                    type: 'text',
                    iconClass: 'business'
                },
                timezone: {
                    name: 'timezone',
                    label: getText('Timezone'),
                    type: 'select',
                    placeholder: getText('-- local time --'),
                    options: _generateTimezoneOptions(this),
                    iconClass: 'language'
                },
                phone: {
                    name: 'phone',
                    label: getText('Phone'),
                    type: 'phone',
                    iconClass: 'phone'
                },
                fax: {
                    name: 'fax',
                    label: getText('Fax'),
                    type: 'phone',
                    iconClass: 'fa-fax'
                }
            });
        },
        getInitialVenueValues(venueId) {
            const selectedVenue = _findSelectedVenue(venueId, this);

            return _generateVenueData(selectedVenue);
        },
        onFormChangedVenue(name, value) {
            let updatedData = null;

            // if we change the venue drop down we need to change the form data to match
            if (name === 'venueid') {
                const selectedVenue = _findSelectedVenue(value, this);

                updatedData = _generateVenueData(selectedVenue);
            }

            return updatedData;
        }
    });
}

export default VenueMixinFactory;