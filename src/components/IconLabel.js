/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const IconLabelFactory = (spec) => {
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

    // Theme
    const IconMap = require('../theme/IconMap');

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
            iconClass: PropTypes.string,
            label: PropTypes.string.isRequired,
            fontSize: PropTypes.string,
            color: PropTypes.string
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
        displayName: 'IconLabel',
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
                color,
                iconClass,
                fontSize,
                label
            } = this.props;

            return (
                <div style={{
                    display: 'flex'
                }}>
                    <div style={{
                        order: 1,
                        marginRight: '4px'
                    }}>
                        {IconMap.getElement(iconClass, {
                            fontSize,
                            color,
                            style: {
                                height: '12px',
                                width: '12px'
                            }
                        })}
                    </div>

                    <div style={{
                        order: 2,
                        flexGrow: 1,
                        fontSize,
                        color
                    }}>
                        {label}
                    </div>
                </div>
            );
        }
    });

    return component;
}

export { IconLabelFactory }