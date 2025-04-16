/**
 * Creates and TravelFlightCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const TravelFlightCardFactory = (spec) => {

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
    const DateToolsFactory = require('../../util/DateTools').default;

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

    const DateTools = DateToolsFactory({});

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
            key: 'legfrom',
            iconClass: '',
            labelFunc: (value) => {
                return getText('From: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'legto',
            iconClass: '',
            labelFunc: (value) => {
                return getText('To: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'legcarrier',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Carrier: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'legcost',
            labelFunc: (value) => {
                return getText('Cost: %1$s', {
                    params: [esUtils.format_currency(value)]
                });
            }
        }, {
            key: 'legflightnum',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Flight #: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'legseat',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Seat: %1$s', {
                    params: [value]
                });
            }
        }, {
            key: 'legticket',
            iconClass: '',
            labelFunc: (value) => {
                return getText('Ticket: %1$s', {
                    params: [value]
                });
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
        displayName: 'TravelFlightCard',
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
            let data = travel.get('flight');

            let subHeadingCollection = [];

            // Need to get details for each Leg
            // then sort them by time
            // then add in more details if showDetails is set

            data.get('legs').sortBy((leg) => {
                return DateTools.convertFromBalboaTrunkTimestamp(leg.get('legleave'));
            }).map((leg) => {
                let time = DateTools.convertFromBalboaTrunkTimestamp(leg.get('legleave'));

                time = esUtils.format_date(time, esUtils.format_date.masks.shortTime);

                subHeadingCollection.push({
                    subHeading: getText('%1$s Departure', {
                        params: [time]
                    }),
                    iconClass: 'fa-clock-o'
                });

                time = DateTools.convertFromBalboaTrunkTimestamp(leg.get('legarrive'));

                time = esUtils.format_date(time, esUtils.format_date.masks.shortTime);

                subHeadingCollection.push({
                    subHeading: getText('%1$s Arrival', {
                        params: [time]
                    }),
                    iconClass: 'fa-clock-o'
                });

                if (showDetails) {
                    let headingMap = this.buildHeadingMap({
                        record: leg,
                        inst: this
                    });

                    let deets = this.extractHeadings(headingMap, [
                        'legfrom',
                        'legto',
                        'legcarrier',
                        'legflightnum',
                        'legseat',
                        'legticket',
                        'legcost'
                    ]);

                    subHeadingCollection = subHeadingCollection.concat(deets);
                }
            });

            return <ListCard
                leftAvatarIcon="flight"
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

export { TravelFlightCardFactory }