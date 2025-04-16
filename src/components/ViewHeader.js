/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ViewHeaderFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Components
    const Subheader = require('material-ui/Subheader').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            label: PropTypes.string,
            children: PropTypes.string
        }
    });

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    return createClass({
        /**
         * Used in debug messages
         */
        displayName: 'ExampleComp',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                label,
                children
            } = this.props;

            return (
                <Subheader style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgb(224, 224, 224)'
                }}>{children || label}</Subheader>
            );
        }
    });
}

export { ViewHeaderFactory }