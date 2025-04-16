/**
 * Creates an ProductForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const ProductFormFactory = (spec) => {
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

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory,
        SubViewMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Forms
    const {
        PanelFactory
    } = require('../components');

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        ProductActionsFactory,
        SpeakerInfoActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;
    const DateTools = require('../util/DateTools').default({});

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        showDeleteConfirmation
    } = DialogActionsFactory({});
    const {
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        extractSelectedProduct,
        deleteProduct
    } = ProductActionsFactory({});
    const {
        extractSpeakerProduct
    } = SpeakerInfoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _actionDeleteProduct;
    let _buildProductSchema;
    let _updateHeaderActions;

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteProduct = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    dispatch,
                    event
                } = inst.props;
                const selectedProduct = event.get('selectedProduct');

                dispatch(toggleEventDirty(true));
                dispatch(deleteProduct({
                    id: selectedProduct.get('id')
                }));
                dispatch(toggleViewDirty(false));
                dispatch(popSubView());
            },
            text: getText('Are you sure you want to delete this %1$s?', {
                params: [getText('Product')]
            })
        }));
    };

    /**
     *
     * @param inst
     * @returns {object}
     * @private
     */
    _buildProductSchema = (inst) => {
        return {
            groupcode: {
                name: 'groupcode',
                label: getText('Code'),
                type: 'select',
                options: inst.generateGroupCodeOptions('productcodes'),
                validate: v.required,
                iconClass: 'fa-group'
            },
            description: {
                name: 'description',
                label: getText('Description'),
                type: 'text',
                iconClass: 'fa-pencil-square'
            },
            qtysold: {
                name: 'qtysold',
                label: getText('Number Sold'),
                type: 'number',
                iconClass: 'fa-balance-scale',
                validate: v.blankOr(v.integer)
            },
            qtyshipped: {
                name: 'qtyshipped',
                label: getText('Number Shipped'),
                type: 'number',
                iconClass: 'fa-ship',
                validate: v.blankOr(v.integer)
            },
            priceeach: {
                name: 'priceeach',
                label: getText('Price'),
                type: 'number',
                iconClass: 'attach-money',
                validate: v.blankOr(v.currency)
            }
        };
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _updateHeaderActions = (inst, props) => {
        let currentProps = props || inst.props;

        const {
            dispatch,
            event
        } = currentProps;

        const selectedProduct = event.get('selectedProduct');

        let actions = inst.determineSaveAction(currentProps);

        if (selectedProduct.get('id') && DateTools.parseNum(selectedProduct.get('id')) !== 0) {
            actions.push({
                type: BTN.DELETE,
                onClick: (event) => {
                    stopProp(event);

                    _actionDeleteProduct(inst);
                }
            });
        }

        dispatch(setHeaderActions(actions));
    };

    /**********************************
     * Components
     *********************************/

    const Panel = PanelFactory({});

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'nav',
            'event',
            'speakerInfo'
        ]
    });

    const SubViewMixin = SubViewMixinFactory({});

    const ViewMixin = ViewMixinFactory({
        overrides: {
            updateHeaderActions(props) {
                // This is called inside ViewMixin, so 'this' references the react component
                _updateHeaderActions(this, props);
            }
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'ProductForm',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin, ViewMixin, SubViewMixin],
        /**
         * Generates the full schema to build the form inputs
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            return _buildProductSchema(this);
        },

        /**
         * @returns {object}
         */
        getInitialValues() {
            const {
                event
            } = this.props;

            const selectedProduct = event.get('selectedProduct');
            const modifiedEvent = event.get('modifiedEvent');
            const product = extractSelectedProduct(event, selectedProduct.get('id'));

            let initialValues = {};

            _.map([
                'groupcode',
                'description',
                'qtysold',
                'qtyshipped',
                'priceeach'
            ], (key) => {
                initialValues[key] = (product.get(key) ? product.get(key).toString() : null);
            });

            return initialValues;
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            if (name === 'groupcode') {
                // find the group code data and pre-populate form
                const product = extractSpeakerProduct(this.props.speakerInfo, value);

                let updatedState = {
                    description: '',
                    qtysold: '',
                    qtyshipped: '',
                    priceeach: ''
                };

                if (product) {
                    updatedState = _.assign(updatedState, product.toJS());
                }

                this.setState({
                    data: _.assign({}, this.state.data, updatedState)
                });
            }

            dispatch(toggleViewDirty(true));
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event
            } = this.props;

            const selectedProduct = event.get('selectedProduct');

            let mode = this.determineMode(selectedProduct.get('id'));

            return <form
                ref='product-form'
                onSubmit={this.Form_onSubmit}>

                <Panel
                    headingText={getText('%1$s Product', {params: [mode]})}
                    headingIconClass='fa-dollar'>
                    {this.generateFields({
                        fields: this.buildSchema()
                    })}
                </Panel>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ProductFormFactory }
