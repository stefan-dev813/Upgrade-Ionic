/**
 * Generates DrawerItem component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const DrawerItemFactory = (spec) => {

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

    const MenuItem = require('material-ui/MenuItem').default;

    const IconMap = require('../theme/IconMap');

    // Actions
    const {
        EventActionsFactory,
        NavActionsFactory
    } = require('../actions');

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
     * Variables
     *********************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});
    const {
        changeEventView
    } = NavActionsFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            iconClass: PropTypes.string,
            view: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used for debug messages
         */
        displayName: 'DrawerItem',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                dispatch,
                iconClass,
                view
            } = this.props;

            return (
                <MenuItem
                    {...this.props}
                    leftIcon={IconMap.getElement(iconClass)}
                    onClick={(e) => {
                        stopProp(e);

                        dispatch(changeEventView(view, true));
                    }}>
                    {view.get('label')}
                </MenuItem>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DrawerItemFactory }