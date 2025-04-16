/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobButtonFactory = (spec = {}) => {
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
    const RaisedButton = require('material-ui/RaisedButton').default;

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
            label: PropTypes.string.isRequired,
            clickHandler: PropTypes.func.isRequired,
            primary: PropTypes.bool,
            secondary: PropTypes.bool
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
        displayName: 'JobButton',
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
                clickHandler,
                primary,
                secondary
            } = this.props;

            return (
                <div style={{
                    padding: '10px'
                }}>
                    <RaisedButton label={label} primary={primary} secondary={secondary} fullWidth={true} onClick={() => {
                        if(_.isFunction(clickHandler)) {
                            clickHandler();
                        }
                    }}/>
                </div>
            );
        }
    });

    return component;
}

export { JobButtonFactory }