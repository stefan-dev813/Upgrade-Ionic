/**
 * Creates an ExampleComp component
 *
 * @param {object} spec - Container for named parameters
 * @property {object} spec.overrides - Methods and properties to override the
 * public interface
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const ExampleCompFactory = (spec) => {
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

    // Components
    const {
        CompAFactory
    } = require('./comps');

    // Mixins
    const ViewMixinFactory = require('../ViewMixin').default;
    const AutoShouldUpdateMixinFactory = require('../AutoShouldUpdateMixinFactory').default;

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        TranslateActionsFactory
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
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    const UNIT = 123;

    /**********************************
     * Methods
     *********************************/

    // We declare them first so they can reference each other without worrying about
    // declaration order.

    let _method1;
    let _method2;
    let _handler;

    /**
     * Handles the Click/Touch event.  Toggles on the state.
     * @param {object} inst - Reference to React component
     * @private
     */
    _handler = (inst) => {
        const {
            toggle
        } = inst.state;

        inst.setState({
            toggle: !toggle
        });
    };

    /**
     * Example of calling other private methods out of order.
     *
     * @param {*} param
     * @param {object} inst - Reference to React Component/Public Interface
     * @private
     */
    _method1 = (param, inst) => {
        _method2(param);
    };

    /**
     * Logging example
     *
     * @param {*} param
     * @private
     */
    _method2 = (param) => {
        log('ExampleComp::_method2');
        log(`param: ${param}`);
    };

    /**********************************
     * Components
     *********************************/

    // We do factories last so it can include items from Variables and Methods
    // in the spec

    const CompA = CompAFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            iconClass: PropTypes.string.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({
        overrides: {
            /**
             * @override
             */
            updateHeaderActions() {
                // no-op
            }
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    // We use lodash assign to build your components public interface, allowing
    // for overrides via object composition.

    return createClass(_.assign({
            /**
             * Used in debug messages
             */
            displayName: 'ExampleComp',
            /**
             * Specifies what we expect in 'this.props'. Allows you to validate
             * props being passed to your components.
             */
            propTypes: {
                iconClass: PropTypes.string.isRequired
            },
            /**
             * Allows you to use mixins to share behavior among multiple components.
             */
            mixins: [AutoShouldUpdateMixin, ViewMixin],
            /**
             * Allows you to define static methods that can be called on
             * the component class
             */
            statics: {
                myStaticMethod() {
                    log('ExampleComp::myStaticMethod');
                }
            },
            /**
             * Invoked once before the component is mounted. The return value
             * will be used as the initial value of this.state.
             *
             * @returns {object}
             */
            getInitialState() {
                return {
                    toggle: true
                };
            },
            /**
             * Invoked once and cached when the class is created. Values in
             * the mapping will be set on this.props if that prop is not
             * specified by the parent component
             *
             * @returns {object}
             */
            getDefaultProps() {
                return {
                    iconClass: 'fa-check'
                };
            },
            /**
             * Invoked once immediately before the initial rendering occurs.
             */
            UNSAFE_componentWillMount() {
                // register services
            },
            /**
             * Invoked once immediately after the initial rendering occurs.
             */
            componentDidMount() {
                // note the lack of 'this' to call the method
                _method2(this);
            },
            /**
             * Invoked when a component is receiving new props. This method
             * is not called for the initial render.
             *
             * @param {object} nextProps
             */
            componentWillReceiveProps(nextProps) {
                // call this.setState if certain props are changed
            },
            /**
             * Invoked before rendering when new props or state are being received.
             * Use this as an opportunity to return false when you're certain
             * that the transition to the new props and state will not require
             * a component update.
             *
             * @param nextProps
             * @param nextState
             */
            shouldComponentUpdate(nextProps, nextState) {
                return true;
            },
            /**
             * Invoked immediately before rendering when new props or state
             * are being received.
             *
             * @param nextProps
             * @param nextState
             */
            UNSAFE_componentWillUpdate(nextProps, nextState) {
                // do not use this.state here
            },
            /**
             * Invoked immediately after the component's updates are
             * flushed to the DOM.
             *
             * @param prevProps
             * @param prevState
             */
            componentDidUpdate(prevProps, prevState) {
                // using this.state here will cause an infinite loop
            },
            /**
             * Invoked immediately before a component is unmounted from the DOM.
             */
            componentWillUnmount() {
                // garbage collection or other clean-up items
            },
            /**
             * The render() method is required. Generates the virtual DOM/HTML.
             * @returns {*}
             */
            render() {
                // extract/declare all used variables at the top instead of referencing
                // this.state or this.props directly later on.
                const {
                    toggle
                } = this.state;

                // Note the lack of 'this' for referencing the private methods
                return <div
                onClick = {
                        () => {
                            _handler(this);
                        }
                    } >
                    <CompA propA={toggle}
                           {...this.props}>
                        {getText('Example Comp')}
                    </CompA> </div>;
            }
        },
        // Overrides the above methods
        (spec ? spec.overrides : null)));
}

// export the factory so everyone else generates the public interface fresh
export default ExampleCompFactory;