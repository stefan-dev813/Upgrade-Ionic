/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SectionHeaderFactory = (spec = {}) => {
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
        displayName: 'SectionHeader',
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
                    borderBottom: '2px solid rgba(66, 137, 201, 0.75)'
                }}>{children || label}</Subheader>
            );
        }
    });
}

export { SectionHeaderFactory }