/**
 * Creates and TravelGroundCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const TravelGroundCardFactory = (spec) => {

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
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            travel: PropTypes.object.isRequired
        },
        compareState: true
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'transportmode',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Mode: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'confirmation',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Conf #: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'pickupinstructions',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Pick-up Inst: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'cost',
            labelFunc: (value) => {
                return esUtils.format_currency(value, 2);
            }
        }, {
            key: 'payment',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Payment: %1$s', {
                    params: [value]
                });
            },
            emptyFunc: (value) => {
                return (!_.isEmpty(value) && value !== "0");
            }
        }]
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
        displayName: 'TravelGroundCard',
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
                travel
            } = this.props;

            const {
                showDetails
            } = this.state;

            let description = travel.get('description');
            let date = travel.get('date');
            let data = travel.get('ground');

            let headingMap = this.buildHeadingMap({
                record: data,
                inst: this
            });

            let subHeadingCollection = [];

            if (showDetails) {
                subHeadingCollection = this.extractHeadings(headingMap, [
                    'transportmode',
                    'confirmation',
                    'pickupinstructions',
                    'cost',
                    'payment'
                ]);
            }

            let formattedTime = esUtils.format_date(date, esUtils.format_date.masks.shortTime);

            subHeadingCollection.unshift({
                subHeading: formattedTime,
                iconClass: 'fa-clock-o'
            });

            return <ListCard
                leftAvatarIcon="directions-car"
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

export { TravelGroundCardFactory }