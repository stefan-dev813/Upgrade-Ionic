/**
 * Builds an AutoShouldUpdate Mixin.  This Mixin will build your propTypes and
 * shouldComponentUpdate checks based on passed in parameters
 *
 * @param spec
 * @param {object} spec.propTypes - (required) Same definitions you'd normally put in propTypes
 * @param {array} spec.propsPriority - (optional) Optional ordering of how to compare the propTypes
 * @param {boolean} spec.compareState - (optional) Compare state
 * @param {array} spec.statePriority - (optional) Optional ordering of how to compare the state
 * @param {function} spec.additionalComparison - (optional) Custom function for additional comparison
 *
 * @property {object} propTypes
 * @property {function} shouldComponentUpdate
 * @property {function} mapStateToProps
 *
 * @returns {{propTypes: object, shouldComponentUpdate: function, mapStateToProps: function}}}
 * @constructor
 * @mixin
 */
const AutoShouldUpdateMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const {
        is,
        Iterable,
        Record
    } = require('immutable');
    const deepEqual = require('deep-equal');

    // Utils
    const {
        log,
        warn
    } = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    const {
        propTypes,
        propsPriority,
        compareState,
        statePriority,
        additionalComparison
    } = spec;

    /**********************************
     * Methods
     *********************************/

    let _compareObjectAndPriorities;
    let _comparePropsAndPriorities;
    let _compareStateAndPriorities;
    let _determineEquals;

    /**
     * Compares an object's properties and an array of keys to see if there are any
     * differences.
     *
     * @param {object} obj
     * @param {array} priorities
     * @returns {boolean}
     * @private
     */
    _compareObjectAndPriorities = (obj, priorities) => {
        let equals = true;

        if (!priorities) {
            return equals;
        }

        if (_.size(obj) !== _.size(priorities)) {
            return false;
        }

        _.map(obj, (value, key) => {
            if (equals && !_.includes(priorities, key)) {
                equals = false;
            }
        });

        if (!equals) {
            return equals;
        }

        _.map(priorities, (key) => {
            if (equals && !_.has(obj, key)) {
                equals = false;
            }
        });

        return equals;
    };

    /**
     * Compares propTypes and propPriorities to make sure they are compatible
     *
     * @param {object} props
     * @param {array} priorities
     * @private
     */
    _comparePropsAndPriorities = (props, priorities) => {
        let equals = true;

        equals = _compareObjectAndPriorities(props, priorities);

        if (!equals) {
            warn(`WARNING: Your propsPriority does not match your propTypes (AutoShouldUpdateMixinFactory)`);
        }
    };

    /**
     * Compares state and statePriorities to make sure they are compatible
     *
     * @param {object} props
     * @param {array} priorities
     * @private
     */
    _compareStateAndPriorities = (props, priorities) => {
        let equals = true;

        equals = _compareObjectAndPriorities(props, priorities);

        if (!equals) {
            warn(`WARNING: Your statePriority does not match your state (AutoShouldUpdateMixinFactory)`);
        }
    };

    /**
     * Equals can be complicated depending on the type of object we are looking at
     *
     * @param {*} a
     * @param {*} b
     * @returns {boolean}
     * @private
     */
    _determineEquals = (a, b) => {
        if (Iterable.isIterable(a)) {
            return is(a, b);
        }

        // Functions will always return false causing it to always update so we just set them to match (as they would
        // in almost all cases anyway)
        if (_.isFunction(a)) {
            return true;
        }

        return deepEqual(a, b);
    };

    /**********************************
     * Validation
     *********************************/

    if (!propTypes || !_.size(propTypes)) {
        warn('WARNING: You did not include a propTypes (AutoShouldUpdateMixinFactory)');
    }

    if (propsPriority && _.size(propTypes) !== _.size(propsPriority)) {
        warn(`WARNING: Your propsPriority does not match your propTypes (AutoShouldUpdateMixinFactory)`);
    }

    _comparePropsAndPriorities(propTypes, propsPriority);

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        /**
         * Specifies what we expect in 'this.props'. Allows you to validate
         * props being passed to your components.
         */
        propTypes,
        /**
         * Invoked before rendering when new props or state are being received. This method
         * is not called for the initial render or when forceUpdate is used.
         *
         * Use this as an opportunity to return false when you're certain that the transition
         * to the new props and state will not require a component update.
         *
         * Should first check the properties it cares about, then check it's children's
         * shouldComponentUpdate() to determine if it needs to render down the line.
         *
         * is() check with Immutable should be fast and should be set to return true
         * at easiest to most expensive check.
         *
         * @param nextProps
         * @param nextState
         * @returns {boolean}
         */
        shouldComponentUpdate(nextProps, nextState) {
            let shouldUpdate = false;

            /* If no propTypes were provided then don't even bother with an expensive
             * deep check of props, just assume always true, as is the default behavior */
            if (!propTypes || !_.size(propTypes)) {
                return true;
            }

            // Compare the state first, as it should be rarely used, small, and would
            // generally mean there are going to be UI interactions that will change more
            // often than external data
            if (!shouldUpdate && compareState) {
                if (statePriority && _.size(statePriority)) {
                    // this can't happen above because we don't have access to state yet
                    _compareStateAndPriorities(nextState, statePriority);

                    _.map(statePriority, (prop) => {
                        if (!shouldUpdate &&
                            _.has(nextState, prop) && !_determineEquals(nextState[prop], this.state[prop])) {

                            shouldUpdate = true;
                        }
                    });
                }
                else {
                    // doing a property by property check may give a false negative
                    // as you can technically add new items onto a state.  And most
                    // states should be relatively flat/simple and so this check
                    // shouldn't be costly
                    if (!_determineEquals(nextState, this.state)) {
                        shouldUpdate = true;
                    }
                }
            }

            // If we  have been provided a props priority, then iterate over that
            // in the set order.  Only continue checks until we find a mismatch
            if (!shouldUpdate && propsPriority && _.size(propsPriority)) {
                _.map(propsPriority, (prop) => {
                    if (!shouldUpdate &&
                        _.has(propTypes, prop) && !_determineEquals(nextProps[prop], this.props[prop])) {

                        shouldUpdate = true;

                        // we can't be in perf mode but we don't want minor view changes to trigger re-renders
                        // we only want a re-render if the viewport changes notably, such as keyboard coming up
                        if (prop === 'browser') {
                            const nextBrowser = nextProps[prop];
                            const currentBrowser = this.props[prop];

                            shouldUpdate = ((Math.abs(nextBrowser.height - currentBrowser.height) >= 50) || (Math.abs(nextBrowser.width - currentBrowser.width) >= 50));
                        }
                    }
                });
            }
            else {
                // otherwise just iterate over propTypes and compare each specified
                // prop in whatever order was given.  Only continue checks until we find
                // a mismatch
                _.map(propTypes, (value, key) => {
                    if (!shouldUpdate && !_determineEquals(nextProps[key], this.props[key])) {
                        shouldUpdate = true;
                    }
                });
            }

            // If they provided a custom checker, run that if we still haven't found
            // a mismatch.
            if (!shouldUpdate && _.isFunction(additionalComparison)) {
                shouldUpdate = additionalComparison(nextProps, nextState, this);
            }

            return shouldUpdate;
        },
        /**
         * Takes in the application state and extracts the properties from it that it
         * would like to have passed in as props.  It will be added as a listener
         * for these items when they are changed.
         *
         * @param {object} state
         * @returns {object}
         * @private
         */
        mapStateToProps(state) {
            let inject = {};
            _.map(propTypes, (val, key) => {
                if (_.has(state, key)) {
                    inject[key] = state[key];
                }
            });
            return inject;
        }
    };
}

export default AutoShouldUpdateMixinFactory;