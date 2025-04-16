/**
 * Generates a Panel component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const PanelFactory = (spec) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Components
    const {SectionHeaderFactory} = require('./SectionHeader');

    // Actions
    const {
        EventActionsFactory
    } = require('../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Components
    //---------------------------------

    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    return createClass({
        propTypes: {
            headingText: PropTypes.string,
            headingIconClass: PropTypes.string,
            padding: PropTypes.bool,
            expandCollapseEnabled: PropTypes.bool,
            expanded: PropTypes.bool,
            actionIconClass: PropTypes.string,
            actionClick: PropTypes.func
        },

        /**
         * Used in debug messaging
         */
        displayName: 'Panel',

        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                padding: true
            };
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            let {
                headingText,
                headingIconClass,
                padding,
                expandCollapseEnabled,
                expanded,
                actionIconClass,
                actionClick
            } = this.props;

            if (expandCollapseEnabled) {
                actionIconClass = (!expanded ? 'fa-caret-square-o-up' : 'fa-caret-square-o-down');
            }

            let bodyClass = 'panel-body';

            if (padding) {
                bodyClass += ' mbsc-padding';
            }

            return (
                <div className='panel'>
                    <div className="main-heading"
                         onClick={(e) => {
                             stopProp(e);

                             actionClick(e);
                         }}>
                        <SectionHeader label={headingText}/>
                    </div>
                    <div className={bodyClass}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
    });
}

export { PanelFactory }