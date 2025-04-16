/**
 * Builds a Material UI Fields React Component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 *
 * @return {function} - React Component
 */
const MUIFieldsFactory = (spec) => {

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

    // Factories
    const MUIFieldFactory = require('./MUIField').default;

    // MixinsM
    const AutoShouldUpdateMixinFactory = require('../../mixins/AutoShouldUpdateMixin').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Components
     *********************************/

    const MUIField = MUIFieldFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            fields: PropTypes.object.isRequired,
            errors: PropTypes.object,
            buildInput: PropTypes.func.isRequired,
            layout: PropTypes.array
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
        displayName: 'MUIFields',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [],

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            let fields = this.props.fields;
            let errors = this.props.errors;
            let buildInput = this.props.buildInput;

            let layout = this.props.layout;

            if (!layout || !_.isArray(layout)) {
                layout = _.map(fields, (f, name) => {
                    return [name];
                });
            }

            return <div className='mui-fields'>
                {_.map(layout, (row) => {
                    return _.map(row, (name, i) => {
                        return <div key={i}>
                            {(_.has(fields, name) ? <MUIField
                                field={fields[name]}
                                error={((errors) ? errors[name] : null)}
                                buildInput={buildInput}/> : null)}
                        </div>;
                    });
                })}
            </div>;
        }
    });
}

export default MUIFieldsFactory;