/**
 * Generates a StaticView component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const StaticViewFactory = (spec) => {

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
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Components
    const {
        StaticHeaderFactory,
        StaticInputFactory
    } = require('../components/static');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Components
     *********************************/

    const StaticHeader = StaticHeaderFactory({});
    const StaticInput = StaticInputFactory({});

    /**********************************
     * Factories
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            staticComponents: PropTypes.array.isRequired
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
        displayName: 'StaticView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                staticComponents
            } = this.props;

            return <div className="static-view">
                {_.map(staticComponents, (comp, i) => {
                    if(comp === 'header') {
                        return <StaticHeader key={`header-${i+1}`}/>;
                    } else if(comp === 'input') {
                        return <StaticInput key={`input-${i+1}`}/>;
                    }
                })}
            </div>;
        }
    });
}

export { StaticViewFactory }