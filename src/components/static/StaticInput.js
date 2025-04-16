/**
 * Generates a StaticInput component
 *
 * @param spec
 * @returns {*}
 * @constructor
 */
const StaticInputFactory = (spec) => {

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
        displayName: 'StaticInput',

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <div className="static-input-wrapper">
                <div className="static-label"></div>
                <div className="static-input"></div>
            </div>;
        }
    });
}

export { StaticInputFactory }