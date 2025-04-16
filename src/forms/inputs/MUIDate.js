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
const moment = require('moment');

// components
const DatePicker = require('material-ui/DatePicker').default;

const {MUIIconInputFactory} = require('./MUIIconInput').default;

const DateToolsFactory = require('../../util/DateTools').default;

const {
    AutoShouldUpdateMixinFactory
} = require('../../mixins');

/**
 * Generates a MUIDate component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MUIDateFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    const DateTools = DateToolsFactory({});
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
        return moment(val).format(DateTools.masks.DATE_STRING);
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
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.object
            ])
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
        displayName: 'MUIDate',

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
            let {field, value} = this.props;

            if (_.isString(value)) {
                value = moment(value, DateTools.masks.DATE_STRING).toDate();
            }

            return (
                <MUIIconInput
                    field={field}>
                    <DatePicker mode="portrait"
                                firstDayOfWeek={0}
                                ref={field.name}
                                id={field.name}
                                name={field.name}
                                value={value}
                                formatDate={_dateFormatter}
                                autoOk={false}
                                floatingLabelText={field.placeholder || field.label}
                                errorText={field.error}
                                fullWidth={field.fullWidth || true}
                                onChange={(nil, val) => {
                                    _onChange(val, this);
                                }}
                                dialogContainerStyle={{
                                    marginTop: '-36px'
                                }}
                                className='mui-date-picker'
                                {..._.pick(field, ['disabled', 'minDate', 'maxDate'])}/>
                </MUIIconInput>
            );
        }
    });
}

const component = MUIDateFactory({});

export default {
    component,
    MUIDateFactory
 }