/**
 * Generates a ServicesForm component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 */
const ServicesFormFactory = (spec) => {
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

    // Factories
    const {
        PanelFactory,
        AddButtonFactory,
        LinkFactory
    } = require('../components');

    const {
        ProductListFactory,
        ServiceListFactory
    } = require('../components/list');

    const {PayoutDetailViewFactory} = require('../views/jobViews/PayoutDetailView');
    const {MessageContainerFactory} = require('../components/messages/MessageContainer');

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

    const OFFER_STATUS = require('../enums/OFFER_STATUS').default;

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        ProductActionsFactory,
        ServiceActionsFactory,
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
        isMarketPlaceEvent,
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});
    const {
        getMyInfo,
        getOfferStatusIndexByJob,
        getOfferStatusIndexByStatus
    } = JobBoardActionsFactory();
    const {
        selectProduct
    } = ProductActionsFactory({});
    const {
        selectService
    } = ServiceActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const AddButton = AddButtonFactory({});
    const Link = LinkFactory({});
    const Panel = PanelFactory({});
    const ProductList = ProductListFactory({});
    const ServiceList = ServiceListFactory({});
    const PayoutDetailView = PayoutDetailViewFactory({});
    const MessageContainer = MessageContainerFactory({});

    /**********************************
     * Methods
     *********************************/

    let _addProductHandler;
    let _addServiceHandler;
    let _buildPackagesSchema;
    let _buildServicesSchema;
    let _determinePayoutView;
    let _generateLink;
    let _toggleProductDetails;
    let _toggleServiceDetails;

    /**
     *
     * @param inst
     * @private
     */
    _addProductHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectProduct({
            id: '0'
        }));
    };

    /**
     *
     * @param inst
     * @private
     */
    _addServiceHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectService({
            id: '0'
        }));
    };

    /**
     *
     * @returns {object}
     * @private
     */
    _buildServicesSchema = () => {
        return {
            depositPercent: {
                name: 'depositPercent',
                type: 'text',
                label: getText('Deposit Percent'),
                iconClass: 'fa-percent',
                validate: v.blankOr(v.integer)
            }
        };
    };

    /**
     * Builds form input instructions for the Packages section
     *
     * @returns {object}
     * @private
     */
    _buildPackagesSchema = () => {
        return {
            productQtyBoxes: {
                name: 'productQtyBoxes',
                type: 'text',
                iconClass: 'fa-archive',
                label: getText('Qty Boxes'),
                validate: v.blankOr(v.integer)
            },
            productShipper: {
                name: 'productShipper',
                type: 'select',
                iconClass: 'fa-ship',
                label: getText('Shipper'),
                options: _.map([getText('DHL'), getText('FEDEX'), getText('UPS'), getText('USPS'), getText('carry with'), getText('other')], (shipper) => {
                    return {
                        text: shipper,
                        value: shipper
                    };
                })
            },
            productTrackingNumbers: {
                name: 'productTrackingNumbers',
                type: 'text',
                iconClass: 'fa-hashtag',
                label: getText('Tracking Number(s)')
            }
        };
    };

    /**
     *
     * @param inst
     * @returns {XML|JSX}
     * @private
     */
    _determinePayoutView = (inst) => {
        const {
            event,
            jobBoard,
            speakerInfo
        } = inst.props;

        const modifiedEvent = event.modifiedEvent;
        const myInfo = getMyInfo({
            jobBoard,
            speakerInfo,
            eid: modifiedEvent.get('eid')
        });
        const statusIndex = getOfferStatusIndexByJob(myInfo);

        if(statusIndex >= getOfferStatusIndexByStatus(OFFER_STATUS.OFFER_ACCEPTED)) {
            return <PayoutDetailView/>;
        }

        return <MessageContainer>{getText('Once this Marketplace job has an accepted offer, the price and payments will be displayed here.')}</MessageContainer>;
    };

    /**
     * @param inst
     * @returns {JSX|XML}
     * @private
     */
    _generateLink = (inst) => {
        const {
            productTrackingNumbers
        } = inst.state.data;
        let numbers = [];

        if (productTrackingNumbers && productTrackingNumbers.length) {
            numbers = productTrackingNumbers.split(/[^A-Za-z0-9]/);

            if (numbers.length && numbers[0] && _.isString(numbers[0]) && numbers[0].length) {
                return <div className='track-my-packages'>
                    <Link href={`http://www.google.com/#q=${numbers[0]}`}>
                        {getText('Track My Package')}
                    </Link>
                </div>;
            }
        }

        return null;
    };

    /**
     *
     * @param item
     * @param inst
     * @private
     */
    _toggleProductDetails = (item, inst) => {
        inst.setState({
            toggledProductId: item.dataset.productId
        });
    };

    /**
     *
     * @param item
     * @param inst
     * @private
     */
    _toggleServiceDetails = (item, inst) => {
        inst.setState({
            toggledServiceId: item.dataset.serviceId
        });
    };

    /**********************************
     * Mixins
     *********************************/

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            view: PropTypes.object.isRequired
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
         * Used in debugging message
         */
        displayName: 'ServicesForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines all form input build instructions
         *
         * @returns {object}
         */
        buildSchema() {
            return _buildPackagesSchema();
        },

        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                toggledServiceId: undefined,
                toggledProductId: undefined,
                expandAllServices: false,
                expandAllProducts: false
            };
        },

        /**
         * Returns pre-filled values for the form based on the props
         *
         * @param props
         * @returns {object}
         * @overrides FormMixin
         */
        getInitialValues(props) {
            const {
                event
            } = props;
            const modifiedEvent = event.get('modifiedEvent');

            let initialValues = {};

            _.map([
                'depositPercent',
                'productQtyBoxes',
                'productShipper',
                'productTrackingNumbers'
            ], (key) => {
                initialValues[key] = (_.isNumber(modifiedEvent.get(key)) ? modifiedEvent.get(key).toString() : modifiedEvent.get(key));
            });

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         * @overrides FormMixin
         */
        onFormChanged: function (name, value) {
            const {
                dispatch
            } = this.props;

            // TODO: this would definitely get the model updated, but might be too expensive
            dispatch(toggleEventDirty(this.Form_areChangesMade()));
        },

        /**
         * Generates virtual DOM/HTMl
         *
         * @returns {*}
         */
        render() {
            const {
                toggledServiceId,
                toggledProductId,
                expandAllServices,
                expandAllProducts
            } = this.state;

            const {
                event
            } = this.props;

            return <form
                ref='services-form'
                onSubmit={this.Form_onSubmit}>

                {isMarketPlaceEvent(event.modifiedEvent) ? _determinePayoutView(this) : <ServiceList/>}

                {!isMarketPlaceEvent(event.modifiedEvent) ? this.generateFields({fields: _buildServicesSchema()}) : null}

                <ProductList/>

                <Panel
                    headingText={getText('Packages')}
                    headingIconClass='fa-cubes'>

                    {this.generateFields({fields: this.buildSchema()})}

                    {_generateLink(this)}
                </Panel>

                {!isMarketPlaceEvent(event.modifiedEvent) &&
                <AddButton actions={[
                    {
                        label: getText('Add Service'),
                        iconClass: 'attach-money',
                        onClick: (event) => {
                            stopProp(event);

                            _addServiceHandler(this);
                        }
                    },
                    {
                        label: getText('Add Product'),
                        iconClass: 'attach-money',
                        onClick: (event) => {
                            stopProp(event);

                            _addProductHandler(this);
                        }
                    }
                ]}/>
                }

            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ServicesFormFactory }