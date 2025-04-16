/**
 * Generates a ProductList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ProductListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    const MessageModel = require('../../stores/models/MessageModel').default;

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {
        MessageCardFactory,
        ProductCardFactory,
        TotalCardFactory
    } = require('../cards');

    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});
    const ProductCard = ProductCardFactory({});
    const SectionHeader = SectionHeaderFactory({});
    const TotalCard = TotalCardFactory({});

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
         * Used in debug messaging
         */
        displayName: 'ProductList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getInitialState() {
            return {};
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {event} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            const productList = modifiedEvent.get('ProductSale');
            let productTotal = 0;

            return <List>
                <SectionHeader>{getText('Products')}</SectionHeader>

                {productList && productList.size === 0 ?
                    <MessageCard message={new MessageModel({
                        type: 'info',
                        text: getText('Tap the Add button below to create a new %1$s.', {
                            params: [getText('Product')]
                        })
                    })}/>
                    : null}

                {productList ? productList.map((product) => {
                    const qty = product.get('qtysold');
                    const price = product.get('priceeach');

                    let qtyFloat;
                    let priceFloat;

                    if (qty) {
                        qtyFloat = parseFloat(qty);
                    }

                    if (price) {
                        priceFloat = parseFloat(price);
                    }

                    if (qtyFloat && priceFloat) {
                        productTotal += (qtyFloat * priceFloat);
                    }

                    return <div key={`product-${product.get('id')}`}>
                        <ProductCard
                            product={product}/>

                        <Divider/>
                    </div>;
                }) : null}

                {productList && productList.size ? <TotalCard
                    description={getText('Qty x Price')}
                    total={productTotal}/> : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ProductListFactory }