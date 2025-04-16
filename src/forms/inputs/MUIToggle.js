/**
 * Generates a MUIToggle component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUIToggleFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     **************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    const Toggle = require('material-ui/Toggle').default;

    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {log} = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _onChange;

    /**
     * Handles checkbox onChange event.  Triggers Form onChange.
     *
     * @param {bool} isToggled
     * @param {object} inst
     * @private
     */
    _onChange = (isToggled, inst) => {
        const {onChange} = inst.props;

        if (_.isFunction(onChange)) {
            onChange(isToggled);
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onChange: PropTypes.func.isRequired,
            field: PropTypes.object.isRequired,
            value: PropTypes.bool
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({

        /**
         * Used for debug messaging
         */
        displayName: 'MUIToggle',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getValue() {
            // TODO: this won't work
            const {field} = this.props;

            return this.refs[`mui-toggle-${field.name}`].checked;
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            let {field, value} = this.props;

            return <Toggle label={field.label}
                           toggled={value || false}
                           style={{
                               marginTop: '20px',
                               marginBottom: '20px',
                               paddingLeft: (field.noIcon ? 0 : '48px')
                           }}
                           labelStyle={{
                             width: `calc(100% - 46px - ${field.noIcon ? '0px' : '48px'})`
                           }}
                           onToggle={(event, isToggled) => {
                               _onChange(isToggled, this);
                           }}
                           {..._.pick(field, 'disabled')}/>;
        }
    });
}

const component = MUIToggleFactory({});

export default {
    component,
    MUIToggleFactory
 }