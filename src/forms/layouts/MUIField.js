/**
 * Creates a Material UI Field React Component
 *
 * @param {object} spec - Container for named parameters
 * @returns {function} - React Component
 * @constructor
 */
const MUIFieldFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../../mixins/AutoShouldUpdateMixin').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            field: PropTypes.object.isRequired,
            error: PropTypes.string,
            buildInput: PropTypes.func.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'MUIField',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [],

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {field, error, buildInput} = this.props;

            return <div ref={field.name}>
                {buildInput(_.assign({}, field, {error: error}))}
            </div>;
        }
    });
}

export default MUIFieldFactory;