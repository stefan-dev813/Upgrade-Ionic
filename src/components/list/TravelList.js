/**
 * Generates a TravelList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const TravelListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    const {fromJS} = require('immutable');

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
        TravelCardFactory
    } = require('../cards');

    const {SectionHeaderFactory} = require('../SectionHeader');
    const {ViewHeaderFactory} = require('../ViewHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildSortedTravelList;

    /**
     *
     * @param {Record|EventModel} event
     * @returns {List}
     * @private
     */
    _buildSortedTravelList = (event) => {
        /**
         * Need to iterate over each list and compile a new list of items
         * based on multiple date items per each current item.  For example,
         * each Leg of a Flight or check-in an check-out are two different entries.
         *
         * Then attach the original data to those new items.
         *
         * Then sort that new collection by date.
         */
        const modifiedEvent = event.get('modifiedEvent');
        const flightList = modifiedEvent.get('Flight');
        const groundList = modifiedEvent.get('Ground');
        const hotelList = modifiedEvent.get('Hotel');

        let travelList = flightList.map((flight) => {
            return fromJS({
                date: flight.get('legs').map((leg) => {
                    return leg.get('legleave');
                }).sort().first(),
                description: flight.get('description'),
                flight: flight
            });
        });

        groundList.map((ground) => {
            return fromJS({
                date: ground.get('starttime'),
                description: ground.get('description'),
                ground: ground
            });
        }).map((item) => {
            travelList = travelList.push(item);
        });

        hotelList.map((hotel) => {
            return fromJS([{
                date: hotel.get('checkindate'),
                description: getText('Check-in %1$s', {
                    params: [hotel.get('name')]
                }),
                hotel: hotel
            }, {
                date: hotel.get('checkoutdate'),
                description: getText('Check-out %1$s', {
                    params: [hotel.get('name')]
                }),
                hotel: hotel
            }]);
        }).map((item) => {
            item.map((subItem) => {
                travelList = travelList.push(subItem);
            });
        });

        travelList = travelList.sortBy((item) => {
            let date = item.get('date');

            if (!date)
                return null;

            date = DateTools.convertFromBalboaTrunkTimestamp(date);

            return date;
        });

        return travelList;
    };

    /**********************************
     * Components
     *********************************/

    const MessageCard = MessageCardFactory({});
    const SectionHeader = SectionHeaderFactory({});
    const ViewHeader = ViewHeaderFactory({});
    const TravelCard = TravelCardFactory({});

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
        displayName: 'TravelList',

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
            const travelList = _buildSortedTravelList(event);
            let lastDate;

            return <List>
                <ViewHeader>{getText('Itinerary')}</ViewHeader>

                {travelList && travelList.size === 0 ?
                    <MessageCard message={new MessageModel({
                        type: 'info',
                        text: getText('You do not currently have any Travel items.')
                    })}/>
                    : null}

                {travelList ? travelList.map((travel, i) => {
                    let date = travel.get('date');
                    let formattedDate;
                    let formattedLastDate;
                    let dateChanged = false;

                    if (date) {
                        date = DateTools.convertFromBalboaTrunkTimestamp(date);

                        if (DateTools.convertToBalboaTrunkTimestamp(date) < 0) {
                            date = null;
                        }

                        if (!lastDate) {
                            lastDate = date;
                            dateChanged = true;
                        }

                        formattedLastDate = esUtils.format_date(lastDate, esUtils.format_date.masks.mediumDate);
                        formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);

                        if (formattedDate !== formattedLastDate) {
                            lastDate = date;
                            dateChanged = true;
                        }
                    }

                    return <div key={`travel-${i}`}>

                        {dateChanged ? <SectionHeader>{formattedDate}</SectionHeader> : null}

                        <TravelCard
                            travel={travel}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TravelListFactory }