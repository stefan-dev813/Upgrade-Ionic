/**
 * Generates a CSSTransistor component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const CSSTransistorFactory = (spec) => {
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
     * Methods
     *********************************/

    let _determineClassName;

    /**
     * Determines the class name to be appended to the child
     *
     * @param {object} element - Reference to child element
     * @param {object} inst - Reference to React Component
     * @returns {string}
     * @private
     */
    _determineClassName = (element, inst) => {
        const {
            transitionName
        } = inst.props;
        const {
            currentClassSuffix
        } = inst.state;

        let retVal = `${element.props.className} ${transitionName}`;

        if (currentClassSuffix && currentClassSuffix.length) {
            retVal += `-${currentClassSuffix}`;
        }

        return retVal;
    };

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used for debug messages
         */
        displayName: 'CSSTransistor',
        propTypes: {
            transitionName: PropTypes.string.isRequired,
            transitionEnterTimeout: PropTypes.number.isRequired,
            transitionLeaveTimeout: PropTypes.number.isRequired
        },
        /**
         * Sets up the components initial state
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                currentClassSuffix: 'enter'
            };
        },

        /**
         * Transitions the children into the Leave state
         */
        performEnter() {
            this.setState({
                currentClassSuffix: 'enter-active'
            }, () => {
                setTimeout(() => {
                    this.setState({
                        currentClassSuffix: 'leave'
                    });
                }, this.props.transitionEnterTimeout);
            });
        },

        /**
         * Transitions the children into the Enter state
         */
        performLeave() {
            this.setState({
                currentClassSuffix: 'leave-active'
            }, () => {
                setTimeout(() => {
                    this.setState({
                        currentClassSuffix: 'enter'
                    });
                }, this.props.transitionLeaveTimeout);
            });
        },

        /**
         * Generates the virtual DOM/HTML.
         *
         * @returns {*}
         */
        render() {
            const {
                children
            } = this.props;

            const newChildren = React.Children.map(children, (element) => {
                return React.cloneElement(element, _.assign({}, element.props, {
                    className: _determineClassName(element, this)
                }));
            });

            return <div className='css-transistor-wrapper'>
                {newChildren}
            </div>;
        }
    });
}

export { CSSTransistorFactory }
