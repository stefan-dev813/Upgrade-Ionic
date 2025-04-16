/* global navigator */
function ResponsiveLogFactory() {
    //-------------------------------------------------------------------------
    //
    // Imports
    //
    //-------------------------------------------------------------------------

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../mixins/AutoShouldUpdateMixin').default;

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    const isMobile = require('ismobilejs');

    const stringifyObject = require('stringify-object');

    const Platform = require('../util/Platform').default;

    //-------------------------------------------------------------------------
    //
    // Private Members
    //
    //-------------------------------------------------------------------------

    //---------------------------------
    // Variables
    //---------------------------------

    const propTypes = {
        browser: PropTypes.object.isRequired
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes
    });

    //-------------------------------------------------------------------------
    //
    // Public Interface
    //
    //-------------------------------------------------------------------------

    const component = createClass({
        displayName: 'ResponsiveLog',

        propTypes,

        render() {
            const {
                browser
            } = this.props;


            return (
                <div>
                    <div>Platform.isTablet: {Platform.isTablet(browser).toString()}</div>
                    <div>{navigator.userAgent}</div>
                    <div>{stringifyObject(isMobile.tablet)}</div>
                    <div>{stringifyObject(browser)}</div>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ResponsiveLogFactory }