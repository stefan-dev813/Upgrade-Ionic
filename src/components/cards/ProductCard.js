/**
 * Creates and ProductCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const ProductCardFactory = (spec) => {

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

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        ProductActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});

    const {
        deleteProduct,
        selectProduct
    } = ProductActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _deleteHandler;
    let _editHandler;

    /**
     *
     * @param inst
     * @private
     */
    _deleteHandler = (inst) => {
        const {
            dispatch,
            product
        } = inst.props;

        dispatch(toggleEventDirty(true));

        dispatch(deleteProduct({
            id: product.get('id')
        }));
    };

    /**
     *
     * @param inst
     * @private
     */
    _editHandler = (inst) => {
        const {
            dispatch,
            product
        } = inst.props;

        dispatch(selectProduct({
            id: product.get('id')
        }));
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            product: PropTypes.object.isRequired,
            showDetails: PropTypes.bool
        },
        propsPriority: [
            'showDetails',
            'product'
        ],
        compareState: true
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'description',
            iconClass: ''
        }, {
            key: 'qtysold',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Sold: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'qtyshipped',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Shipped: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'priceeach',
            labelFunc: (value) => {
                return esUtils.format_currency(value, 2);
            }
        }]
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
        displayName: 'ProductCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, CardMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                product
            } = this.props;

            const showDetails = (this.props.showDetails || this.state.showDetails);

            let subHeadingCollection;

            let headingMap = this.buildHeadingMap({
                record: product,
                inst: this
            });

            subHeadingCollection = this.extractHeadings(headingMap, [
                'description',
                'qtysold',
                'qtyshipped',
                'priceeach'
            ]);

            let heading = '';
            if (subHeadingCollection && subHeadingCollection.length) {
                heading = subHeadingCollection.shift().subHeading;
            }

            const groupCode = product.get('groupcode');

            const menuItems = this.getMenuItems(['expand', 'edit', 'delete'], {
                onEdit: () => {
                    _editHandler(this);
                },
                onDelete: () => {
                    _deleteHandler(this);
                }
            }, this);

            if (!showDetails) {
                subHeadingCollection = subHeadingCollection.slice(0, 2);
            }

            return <ListCard
                leftAvatarText={groupCode}
                menuItems={menuItems}
                primaryText={heading}
                secondaryText={_.flatMap(subHeadingCollection, (s) => {
                    return s.subHeading;
                })}
                onClick={(e) => {
                    stopProp(e);

                    _editHandler(this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ProductCardFactory }