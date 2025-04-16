/**
 * Generates a Link component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LinkFactory = (spec) => {

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

    // Actions
    const {
        EventActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            href: PropTypes.string,
            onClick: PropTypes.func
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
        displayName: 'Link',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            let {
                href,
                onClick,
                children
            } = this.props;

            href = href || '#';

            onClick = onClick || function() {
                window.open(href, '_system');
            };

            return <a href = {
                href
            }
            onClick = {
                (event) => {
                    stopProp(event);

                    onClick();
                }
            } > {
                children
            } </a>;
        }
    });
}

export { LinkFactory }
