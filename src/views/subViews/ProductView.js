/**
 * Creates an ProductView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const ProductViewFactory = (spec) => {

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

    // Forms
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {
        ProductFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        ProductActionsFactory,
        NavActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        extractSelectedProduct,
        saveProduct
    } = ProductActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     *
     * @param form
     * @param inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');

        const selectedProduct = extractSelectedProduct(event);

        dispatch(saveProduct(_.assign({
                id: '0'
            },
            (selectedProduct ? selectedProduct.toJS() : {}),
            _.pick(form, [
                'groupcode',
                'qtysold',
                'description',
                'qtyshipped',
                'priceeach'
            ]))));

        dispatch(toggleEventDirty(true));

        dispatch(toggleViewDirty(false));

        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const FormLoading = FormLoadingFactory({});
    const ProductForm = ProductFormFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
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
        displayName: 'ProductView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return (
                <FormLoading>
                    <ProductForm
                        ref='editProductForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }
                    />
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ProductViewFactory }