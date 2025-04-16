/**
 * Generates a MUITime component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUITimeFactory = (spec) => {
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
    const TimePicker = require('material-ui/TimePicker').default;

    const {MUIIconInputFactory} = require('./MUIIconInput').default;

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

    const MUIIconInput = MUIIconInputFactory({});

    /**********************************
     * Methods
     *********************************/

    let _dateFormatter;
    let _onChange;

    /**
     *
     * @param val
     * @returns {string}
     * @private
     */
    _dateFormatter = (val) => {
        // return moment(val).format(DateTools.masks.TIME_STRING);
    };

    /**
     * Handles Text onChange event.  Dispatches the Form's onChange.
     *
     * @param {event} e
     * @private
     */
    _onChange = (val, inst) => {
        const {onChange} = inst.props;

        onChange(val);
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onChange: PropTypes.func.isRequired,
            field: PropTypes.object.isRequired,
            value: PropTypes.object
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
        displayName: 'MUITime',

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
                <MUIIconInput field={field}>
                    <TimePicker mode="portrait"
                                ref={field.name}
                                id={field.name}
                                name={field.name}
                                value={value}
                                autoOk={false}
                                floatingLabelText={field.placeholder || field.label}
                                errorText={field.error}
                                fullWidth={field.fullWidth || true}
                                onChange={(nil, val) => {
                                    _onChange(val, this);
                                }}
                                dialogBodyStyle={{
                                    minHeight: '400px',
                                    maxHeight: 'inherit'
                                }}
                                dialogStyle={{
                                    paddingTop: 0,
                                    marginTop: '-48px'
                                }}
                                dialogContainerStyle={{
                                    marginTop: '-36px'
                                }}
                                {..._.pick(field, ['disabled'])}/>
                </MUIIconInput>
            );
        }
    });
}

const component = MUITimeFactory({});

export default {
    component,
    MUITimeFactory
}