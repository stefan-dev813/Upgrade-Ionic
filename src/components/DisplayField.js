/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const DisplayFieldFactory = (spec = {}) => {
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
            label: PropTypes.string,
            displayText: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
            labelStyle: PropTypes.object,
            displayTextStyle: PropTypes.string,
            children: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
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
        displayName: 'DisplayField',
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
                displayText,
                labelStyle,
                displayTextStyle,
                children
            } = this.props;

            return (
                <div style={{
                    padding: '8px 15px'
                }}>
                    {!_.isEmpty(label) ?
                    <label style={_.assign({
                        fontWeight: 'bold'
                    }, labelStyle)}>{label}</label> : null}

                    {_.isArray(displayText) && !_.isEmpty(displayText) ? _.map(displayText, (text, i) => {
                        return <div key={i} style={_.assign({
                            padding: '8px 0px'
                        }, displayTextStyle)}>{text}</div>;
                    }) : null}

                    {_.isString(displayText) && !_.isEmpty(displayText) ? <div style={_.assign({
                        padding: '8px 0px'
                    }, displayTextStyle)}>{displayText}</div> : null}

                    {children ? <div>{children}</div> : null}
                </div>
            );
        }
    });

    return component;
}

export { DisplayFieldFactory }