/**
 * Generates a FooterNav component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SplashScreenFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

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
            message: PropTypes.string
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
        displayName: 'SplashScreen',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Specifies what we expect to see in this.props
         */
        propTypes: {
            message: PropTypes.string
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                message
            } = this.props;

            return (<div className='splash-screen'>
                { message ? (<div className='message'>{message}</div>) : null }
                </div>);
        }
    });
}

export { SplashScreenFactory }