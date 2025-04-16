/**
 * Creates Actions for i18n translation
 *
 * @param {object} spec
 * @property {string} spec.lang - (optional) Defaults if not provided
 * @returns {object}
 * @constructor
 */
const TranslateActionsFactory = (spec = {}) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const Jed = require('jed');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    // Translations
    const locale = require('../locale');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    let {
        lang
    } = spec;

    lang = lang || 'en_US';

    const translations = locale[lang];

    let i18n = new Jed(_.assign(translations, {
        // This callback is called when a key is missing
        "missing_key_callback": function(key) {
            // Do something with the missing key
            // e.g. send key to web service or
            log(`i18n key not found (${key})`);
        }
    }));

    /**********************************
     * Methods
     *********************************/

    let getCurrency;
    let getText;

    getCurrency = (spec = {}) => {
        const {
            number
        } = spec;

        // TODO: Support other currencies
        return getText('USD $%1$s', {params:[esUtils.format_number(number, 2)]});
    };

    /**
     * Returns the translation for the provided string
     *
     * @param {string} key
     * @param {object} opts
     * @property {string} opts.context
     * @property {Array} opts.params
     * @returns {string}
     * @private
     */
    getText = (key, opts) => {
        const {
            context,
            params
        } = opts || {};

        if (key && params) {
            return i18n.translate(key).fetch(params);
        }
        else {
            return i18n.gettext(key);
        }
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        getCurrency,
        getText,
        jed: i18n
    };
}

export default TranslateActionsFactory;