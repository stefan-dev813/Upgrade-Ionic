/**
 * Creates an SubHeaderCard component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SubHeaderCardFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Components
    const {BaseHeaderCardFactory} = require('./BaseHeaderCard');

    const {
        NavActionsFactory
    } = require('../../actions');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    const {
        getCurrentSubView
    } = NavActionsFactory();

    /**********************************
     * Components
     *********************************/

    const BaseHeaderCard = BaseHeaderCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            nav: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'SubHeaderCard',
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
                nav,
                view
            } = this.props;

            const headerText = view.get('headerText');
            const subView = getCurrentSubView(nav);

            let heading = headerText || subView.get('label');

            return <BaseHeaderCard
                heading={heading}
                headingStyle={{
                    fontSize: '18px'
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SubHeaderCardFactory }