/**
 * Creates a ForgotPasswordForm
 *
 * @param spec
 * @returns {*}
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @constructor
 */
const ForgotPasswordFormFactory = (spec) => {
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

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
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
        stopProp
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const ButtonGroup = MUIButtonGroupFactory({});

    /**********************************
     * Methods
     *********************************/

    let _cancelTouchHandler;

    /**
     * Cancels the form and returns to Login View
     * @param event
     * @private
     */
    _cancelTouchHandler = (inst) => {
        const {
            onCancel
        } = inst.props;

        onCancel();
    };

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            onCancel: PropTypes.func.isRequired,
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
        displayName: 'ForgotPasswordForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin],

        /**
         * Builds the instructions for building the form inputs
         *
         * @returns {{email: {name: string, type: string, iconClass: string, placeholder: string, validate: *, autoFocus: boolean}}}
         */
        buildSchema() {
            return {
                email: {
                    name: 'email',
                    type: 'text',
                    iconClass: 'fa-envelope',
                    icon: false,
                    placeholder: getText('Email'),
                    validate: v.email,
                    autoFocus: true
                }
            };
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <form
                ref='forgot-password-form'
                onSubmit={this.Form_onSubmit}>

                    {this.generateFields({fields: this.buildSchema()})}

                <ButtonGroup buttons={[
                    {
                        type: BTN.SUBMIT,
                        props: {
                            label: getText('Send Email'),
                            primary: true
                        }
                    },
                    {
                        type: BTN.SUBMIT,
                        props: {
                            label: getText('Cancel'),
                            onClick: (e) => {
                                stopProp(e);

                                _cancelTouchHandler(this);
                            }
                        }
                    }
                ]}/>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ForgotPasswordFormFactory }