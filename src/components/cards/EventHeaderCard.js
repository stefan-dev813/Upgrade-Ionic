/**
 * Creates an EventHeaderCard component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 */
const EventHeaderCardFactory = (spec) => {
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

    // Actions
    const {
        SpeakerInfoActionsFactory
    } = require('../../actions');

    // Components
    const {BaseHeaderCardFactory} = require('./BaseHeaderCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        AddressMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        determineMsm
    } = SpeakerInfoActionsFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AddressMixin = AddressMixinFactory({});

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    /**********************************
     * Components
     *********************************/

    const BaseHeaderCard = BaseHeaderCardFactory({});

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'EventHeaderCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, AddressMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event,
                speakerInfo
            } = this.props;

            let heading = event.get('selectedEvent').get('organization');
            let subHeadingCollection = [];

            if (determineMsm(speakerInfo)) {
                subHeadingCollection.push(speakerInfo.get('selectedSpeaker').get('name_full'));
            }

            // get earliest stagetime
            const selectedEvent = event.get('selectedEvent');
            let stageTimes;
            let venues;

            if (selectedEvent) {
                stageTimes = selectedEvent.get('Stagetime');

                if (stageTimes && stageTimes.size) {

                    let firstStartTime = stageTimes.sortBy((stageTime) => {
                        return (stageTime ? stageTime.get('starttime') : null);
                    }).first().get('starttime');

                    let formattedDate = esUtils.format_date(convertFromBalboaTrunkTimestamp(firstStartTime), esUtils.format_date.masks.mediumDate);

                    subHeadingCollection.push(formattedDate);
                }

                venues = selectedEvent.get('Venue');

                if (venues && venues.size >= 1) {
                    let addressString = this.buildLocationString(venues.first().toJS(), ['city', 'st']);
                    if (!_.isEmpty(addressString)) {
                        subHeadingCollection.push(addressString);
                    }
                }
            }

            return <BaseHeaderCard
                heading={heading || ''}
                subHeading={subHeadingCollection.slice(0, 2).join(' | ')}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { EventHeaderCardFactory }