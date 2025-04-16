/**
 * Generates a MUIRadioGroup component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MUIRadioGroupFactory = (spec) => {
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
    const {RadioButton, RadioButtonGroup} = require('material-ui/RadioButton');

    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

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
    let _showDescription;

    /**
     * Handles RadioGroup onChange event.  Dispatches the Form's onChange.
     *
     * @param {string} val
     * @param {object} inst
     * @private
     */
    _onChange = (val, inst) => {
        const {onChange} = inst.props;

        onChange(val);
    };

    /**
     *
     * @param inst
     * @returns {null|XML}
     * @private
     */
    _showDescription = (inst) => {
        const {field, value} = inst.props;

        let selected;

        _.map(field.options, (option) => {
            if (!selected && value === option.value) {
                selected = option;
            }

            return option;
        });

        if (selected && selected.description) {
            return <div style={{paddingTop: '10px'}}>{selected.description}</div>;
        }

        return null;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            field: PropTypes.object.isRequired,
            value: PropTypes.string
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
        displayName: 'MUIRadioGroup',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {field, value} = this.props;

            return (
                <div>
                    <RadioButtonGroup
                        name={field.name}
                        valueSelected={value}
                        onChange={(event, value) => {
                            _onChange(value, this);
                        }}>

                        {_.map(field.options, (option, i) => {
                            return <RadioButton
                                key={`radio-btn-${i}`}
                                style={{paddingTop: '5px', paddingBottom: '5px'}}
                                label={option.label}
                                value={option.value}/>;
                        })}

                    </RadioButtonGroup>

                    {_showDescription(this)}
                </div>
            );
        }
    });
}

const component = MUIRadioGroupFactory({});

export default {
    component,
    MUIRadioGroupFactory
 }