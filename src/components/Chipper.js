/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ChipperFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const _ = require('lodash');

    const Chip = require('material-ui/Chip').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

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
            containerStyle: PropTypes.object,
            chipStyle: PropTypes.object,
            children: PropTypes.func
        }
    });

    //=========================================================================
    //
    // Public Methods
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'Chipper',
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
                containerStyle,
                chipStyle,
                chipLabelStyle,
                chipLabels
            } = this.props;

            return (
                <div style={_.assign({
                    display: 'flex',
                    flexWrap: 'wrap'
                }, containerStyle)}>
                    {_.map(chipLabels, (chipLabel, i) => {
                        return <Chip key={i} style={_.assign({
                            margin: '4px'
                        }, chipStyle)} labelStyle={_.assign({}, chipLabelStyle)}>{chipLabel}</Chip>;
                    })}
                </div>
            );
        }
    });

    return component;
}

export { ChipperFactory }