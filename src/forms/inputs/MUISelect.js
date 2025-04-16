/**
 * Generates a MUISelect component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUISelectFactory = (spec) => {

    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // components
    const SelectField = require('material-ui/SelectField').default;
    const MenuItem = require('material-ui/MenuItem').default;

    const {MUIIconInputFactory} = require('./MUIIconInput').default;

    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {log} = require('../../util/DevTools').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

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
     * Factories
     *********************************/

    const MUIIconInput = MUIIconInputFactory({});

    /**********************************
     * Methods
     *********************************/

    let _selectHandler;

    /**
     * Handles component's onSelect/onChange.  Triggers FormsMixin onChange
     *
     * @param {string} value
     * @param {object} rInst
     * @private
     */
    _selectHandler = (value, rInst) => {
        const {onChange} = rInst.props;

        onChange((value === false ? '' : value));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onChange: PropTypes.func.isRequired,
            field: PropTypes.object.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
        displayName: 'MUISelect',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTMl
         *
         * @returns {*}
         */
        render() {
            const {field, value} = this.props;

            const allowClear = _.has(field, 'allowClear') ? field.allowClear : true;
            const options = field.options;

            if (allowClear && _.isArray(options)) {
                options.unshift(
                    {
                        text: getText('-- Clear Selection --'),
                        value: false
                    }
                );
            }

            return (
                <MUIIconInput field={field}>
                    <SelectField
                        floatingLabelText={field.placeholder || field.label}
                        value={value}
                        fullWidth={field.fullWidth || true}
                        onChange={(event, index, value) => {
                            _selectHandler(value, this);
                        }}
                        {..._.pick(field, ['disabled'])}>

                        {_.map(field.options, (option, i) => {
                            return <MenuItem
                                key={`${option.value}-${i}`}
                                value={option.value}
                                primaryText={option.text}/>;
                        })}
                    </SelectField>
                </MUIIconInput>
            );
        }
    });
}

const component = MUISelectFactory({});

export default {
    component,
    MUISelectFactory
 }