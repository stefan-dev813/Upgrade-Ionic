/**
 * Generates a MUICheckbox component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUICheckboxFactory = (spec) => {
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

    const Checkbox = require('material-ui/Checkbox').default;

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
     * @param {bool} isChecked
     * @param {object} inst
     * @private
     */
    _onChange = (isChecked, inst) => {
        const {onChange} = inst.props;

        if (_.isFunction(onChange)) {
            onChange(isChecked);
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
        displayName: 'MUICheckbox',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getValue() {
            // TODO: this won't work
            const {field} = this.props;

            return this.refs[`mui-check-${field.name}`].checked;
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            let {field, value} = this.props;

            return <Checkbox label={field.label}
                             checked={value || false}
                             labelPosition="left"
                             style={{
                                 marginTop: '20px',
                                 marginBottom: '20px',
                                 paddingLeft: (field.noIcon ? 0 : '48px')
                             }}
                             labelStyle={{
                                 width: `calc(100% - 46px - ${field.noIcon ? '0px' : '48px'})`
                             }}
                             onCheck={(event, isChecked) => {
                                 _onChange(isChecked, this);
                             }}
                             {..._.pick(field, 'disabled')}/>;
        }
    });
}

const component = MUICheckboxFactory({});

export default {
    component,
    MUICheckboxFactory
}