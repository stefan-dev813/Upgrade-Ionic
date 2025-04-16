/**
 * Creates an MultiLineSecondaryText React Component
 *
 * @constructor
 * @param {object} spec - Collection of named parameters
 *
 * @return {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const MultiLineSecondaryTextFactory = (spec) => {

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
    } = require('../../mixins');

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Methods
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            textItems: PropTypes.array.isRequired
        }
    });

    /******************************************************************************
     *
     * React / Public Interface
     *
     *****************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'MultiLineSecondaryText',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                textItems
            } = this.props;

            return <div className="secondary-text">
                {_.map(textItems, (item, i) => {
                    return <p
                        style={{margin: '2px 0', padding: '2px 0'}}
                        key={`secondary-text-${i}`}
                        className={(i === 0 ? 'first' : '')}>

                        {item}

                    </p>;
                })}
            </div>;
        }
    });
}

export { MultiLineSecondaryTextFactory }