/**
 * Generates a StaticHeader component
 *
 * @param spec
 * @returns {*}
 * @constructor
 */
const StaticHeaderFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const {
        createClass
    } = React;

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'StaticHeader',

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <div className="static-header"></div>;
        }
    });
}

export { StaticHeaderFactory }