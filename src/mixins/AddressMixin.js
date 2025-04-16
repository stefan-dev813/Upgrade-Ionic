/**
 * Provides methods to help build out Address Forms
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixin
 */
const AddressMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');

    // Factories

    // Mixins
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        TranslateActionsFactory
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
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generateCountryOptions;
    let _generateStateOptions;

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateCountryOptions = (inst) => {
        const {
            displayData
        } = inst.props;
        const displayLists = displayData.get('displayLists');

        const universal = displayLists.get('universal');
        const countryList = universal.get('countrylist');

        let options = [];

        countryList.map((country) => {
            options.push({
                text: country.get('lc'),
                value: country.get('sc')
            });
        });

        return options;
    };

    /**
     * Generates a state list based on country
     *
     * @param country
     * @param {object} inst
     * @returns {Array}
     * @private
     */
    _generateStateOptions = (country, inst) => {
        const {
            displayData
        } = inst.props;
        const displayLists = displayData.get('displayLists');

        const universal = displayLists.get('universal');
        const filteredStateList = universal.get('statelist').filter((state) => {
            return state.get('sc') === country;
        });

        let options = [];

        filteredStateList.map((state) => {
            options.push({
                text: state.get('ls'),
                value: state.get('ss')
            });
        });

        return options;
    };

    /**********************************
     * Factories
     *********************************/

    /**************************************************************************
     *
     * Public Members
     *
     *************************************************************************/

    return {
        /**
         * Create a common schema for Addresses
         * @returns {object}
         */
        buildAddressSchema(data) {
            return {
                address: {
                    name: 'address',
                    label: getText('Address'),
                    type: 'textarea',
                    iconClass: 'location-on'
                },
                city: {
                    name: 'city',
                    label: getText('City'),
                    type: 'text'
                },
                st: {
                    name: 'st',
                    label: getText('State/Prov'),
                    type: 'select',
                    options: _generateStateOptions((data && data.country) || null, this)
                },
                zip: {
                    name: 'zip',
                    label: getText('Zip/Postal Code'),
                    type: 'text'
                },
                country: {
                    name: 'country',
                    label: getText('Country'),
                    type: 'select',
                    options: _generateCountryOptions(this)
                }
            };
        },
        /**
         * Builds full address string
         * @param {object} data
         * @param {Array} fields
         * @returns {string}
         */
        buildLocationString(data, fields) {
            let parts = [];
            fields = fields || ['address', 'city', 'st', 'country', 'zip'];

            _.map(fields, (field) => {
                if (_.has(data, field) && !_.isEmpty(data[field])) {
                    parts.push(data[field]);
                }
            });

            return parts.join(', ');
        }
    };
}

export default AddressMixinFactory;