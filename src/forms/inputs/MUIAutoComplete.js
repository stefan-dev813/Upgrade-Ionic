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

// components
const AutoComplete = require('material-ui/AutoComplete').default;

const {
    AutoShouldUpdateMixinFactory
} = require('../../mixins');

/**
 * Generates a MUIAutoComplete component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUIAutoCompleteFactory = (spec) => {
    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _onChange;

    /**
     * Handles Text onChange event.  Dispatches the Form's onChange.
     *
     * @param {object|string} selectedItem - Drop down item selected or string entered
     * @param {number} index - Index of selectedItem or -1 if text was entered
     * @param {object} inst
     * @private
     */
    _onChange = (selectedItem, index, inst) => {
        const {onChange} = inst.props;

        if (index !== -1) {
            onChange(selectedItem.value);
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onChange: PropTypes.func.isRequired,
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
        displayName: 'MUIAutoComplete',

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

            let searchText = '';

            _.map(field.options, (opt, i) => {
                if (opt.value.toString() === value.toString()) {
                    searchText = opt.text;
                }
            });

            return <AutoComplete
                ref={field.name}
                id={field.name}
                name={field.name}
                anchorOrigin={{vertical: 'top', horizontal: 'left',}}
                targetOrigin={{vertical: 'bottom', horizontal: 'left',}}
                hintText={field.hintText || 'Type to filter'}
                disabled={field.read_only || field.disabled}
                errorText={field.error}
                openOnFocus={field.openOnFocus || true}
                floatingLabelText={field.placeholder || field.label}
                maxSearchResults={10}
                dataSource={field.options}
                searchText={searchText}
                fullWidth={field.fullWidth || true}
                onNewRequest={(selectedItem, index) => {
                    _onChange(selectedItem, index, this);
                }}/>;

        }
    });
}

const component = MUIAutoCompleteFactory({});

export default {
    component,
    MUIAutoCompleteFactory
}