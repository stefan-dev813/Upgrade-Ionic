/**
 * Generates a LoginForm React Component
 *
 * @param spec
 * @returns {*}
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @constructor
 */
const LoginFormFactory = (spec) => {
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
    const {
        connect
    } = require('react-redux');

    // Enums
    const BTN = require('../enums/BTN').default;

    // Factories
    const MUIButtonGroupFactory = require('./MUIButtonGroup').default;

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

    // Actions
    const {
        TranslateActionsFactory
    } = require('../actions');

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

    const ButtonGroup = MUIButtonGroupFactory({});

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onSubmit: PropTypes.func.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'LoginForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin],

        /**
         * Builds the instructions used to build the form inputs
         *
         * @returns {{username: {name: string, type: string, iconClass: string, placeholder: string, validate: (*|module.exports.v.required|boolean)}, password: {name: string, type: string, iconClass: string, placeholder: string, validate: (*|module.exports.v.required|boolean)}}}
         */
        buildSchema() {
            return {
                username: {
                    name: 'username',
                    type: 'text',
                    iconClass: 'person',
                    label: getText('Username'),
                    validate: v.required
                },
                password: {
                    name: 'password',
                    type: 'password',
                    iconClass: 'lock',
                    label: getText('Password'),
                    validate: v.required
                }
            };
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            return <form ref='login-form'
                         onSubmit={this.Form_onSubmit}>

                {this.generateFields({fields: this.buildSchema()})}

                <ButtonGroup buttons={[
                    {
                        type: BTN.SUBMIT,
                        props: {
                            label: getText('Login'),
                            primary: true
                        }
                    }
                ]}/>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LoginFormFactory }