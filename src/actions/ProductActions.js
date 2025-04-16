/**
 * Generates the Product Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const ProductActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Actions
    const EventActionsFactory = require('./EventActions').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {extractSelectedItem} = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _deleteProduct;
    let _extractSelectedProduct;
    let _saveProduct;
    let _selectProduct;

    /**
     *
     * @param data
     * @private
     */
    _deleteProduct = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_DELETE_PRODUCT,
            payload: data
        };
    };

    /**
     *
     * @param event
     * @returns {*}
     * @private
     */
    _extractSelectedProduct = (event) => {
        return extractSelectedItem(event, 'selectedProduct', 'ProductSale');
    };

    /**
     *
     * @param service
     * @private
     */
    _saveProduct = (product) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_PRODUCT,
            payload: product
        };
    };

    /**
     *
     * @param data
     * @private
     */
    _selectProduct = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_PRODUCT,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.PRODUCT_VIEW
            }
        ];
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        deleteProduct: _deleteProduct,
        extractSelectedProduct: _extractSelectedProduct,
        saveProduct: _saveProduct,
        selectProduct: _selectProduct
    };
}

export default ProductActionsFactory;