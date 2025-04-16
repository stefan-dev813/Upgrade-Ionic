/**
 * Creates and TravelHotelCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const TravelHotelCardFactory = (spec) => {

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

    // Factories
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
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
        stopProp
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildHeadingMap;

    /**
     *
     * @param {object} spec
     * @property {Record} spec.record
     * @property {object} spec.inst
     * @property {object} spec.map
     * @returns {{}}
     * @private
     */
    _buildHeadingMap = (spec) => {
        let map = {};
        let inst = spec.inst;
        const data = spec.record;

        let addressString = inst.buildLocationString(data.toJS());

        if (!_.isEmpty(addressString)) {
            map['address'] = {
                subHeading: addressString,
                iconClass: 'fa-map-marker'
            };
        }
        return map;
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AddressMixin = AddressMixinFactory({});

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            travel: PropTypes.object.isRequired
        },
        compareState: true
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'name',
            iconClass: 'fa-building'
        }, {
            key: 'phone',
            iconClass: 'fa-phone'
        }, {
            key: 'checkoutdate',
            iconClass: 'fa-sign-out',
            labelFunc: (value) => {
                return getText('Check-out');
            }
        }, {
            key: 'checkindate',
            iconClass: 'fa-sign-in',
            labelFunc: (value) => {
                return getText('Check-in');
            }
        }, {
            key: 'confirmation',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Confirmation #: %1$s', {
                    params: [value]
                });
            }
        }],
        additionalMapFunc: _buildHeadingMap
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
        displayName: 'TravelHotelCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, AddressMixin, CardMixin],

        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                travel
            } = this.props;

            const {
                showDetails
            } = this.state;

            let description = travel.get('description');
            let date = travel.get('date');
            let data = travel.get('hotel');

            let headingMap = this.buildHeadingMap({
                record: data,
                inst: this
            });

            let subHeadingCollection = [];

            if (showDetails) {
                subHeadingCollection = this.extractHeadings(headingMap, [
                    'checkindate',
                    'checkoutdate',
                    'name',
                    'address',
                    'phone',
                    'confirmation'
                ]);
            }
            else {
                subHeadingCollection = this.extractHeadings(headingMap, [
                    'checkindate',
                    'checkoutdate'
                ]);
            }

            return <ListCard
                leftAvatarIcon="hotel"
                primaryText={description}
                secondaryText={_.flatMap(subHeadingCollection, (s) => {
                    return s.subHeading;
                })}
                onClick={(e) => {
                    stopProp(e);

                    this.setState({
                        showDetails: !showDetails
                    });
                }}
            />;
        }
    });
}

export { TravelHotelCardFactory }