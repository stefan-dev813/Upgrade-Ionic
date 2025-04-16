/**
 *
 * @param spec
 * @constructor
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const EventInfoCardFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const {fromJS} = require('immutable');

    // Redux
    const {connect} = require('react-redux');

    // Util
    const _ = require('lodash');
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});

    // Enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        SpeakerInfoActionsFactory
    } = require('../../actions');

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Components
    const Avatar = require('material-ui/Avatar').default;
    const {IconLabelFactory} = require('../IconLabel');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        determineMsm
    } = SpeakerInfoActionsFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _buildHeadingMap;
    let _determineStatusColor;
    let _generateAvatar;

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
        let record = spec.record;
        let stageTimes;
        let venues;

        stageTimes = record.get('Stagetime');

        if (stageTimes && stageTimes.size) {

            let firstStartTime = stageTimes.sortBy((stageTime) => {
                return (stageTime ? stageTime.get('starttime') : null);
            }).first().get('starttime');

            let formattedDate = esUtils.format_date(convertFromBalboaTrunkTimestamp(firstStartTime), esUtils.format_date.masks.mediumDate);

            map['strdate'] = {
                subHeading: formattedDate,
                iconClass: 'date-range'
            };
        }

        venues = record.get('Venue');

        if (venues && venues.size >= 1) {
            let addressString = inst.buildLocationString(venues.first().toJS(), ['city', 'st']);
            if (!_.isEmpty(addressString)) {
                map['address'] = {
                    subHeading: addressString,
                    iconClass: 'location-on'
                };
            }
        }

        const deliveryMethod = record.get('deliveryMethod') || 'none';

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod.toString()] || DELIVERY_METHOD_ICONS['0'];

        map['deliveryMethod'] = {
            subHeading: dmIcon.label,
            iconClass: dmIcon.icon
        };

        map['speaker'] = {
            subHeading: `${record.get('name_full')}`,
            iconClass: 'person'
        };

        return map;
    };

    /**
     *
     * @param inst
     * @returns {string}
     * @private
     */
    _determineStatusColor = (inst) => {
        const {
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const status = modifiedEvent.get('status');

        return mainTheme.getStatusColor(status) || mainTheme[`${status}Color`];
    };

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const deliveryMethod = modifiedEvent.get('deliveryMethod') || 'none';

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;
        let bgColor;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        bgColor = _determineStatusColor(inst);

        return <Avatar
            backgroundColor={bgColor}
            icon={avIcon}/>;
    };

    //---------------------------------
    // Components
    //---------------------------------

    const IconLabel = IconLabelFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AddressMixin = AddressMixinFactory({});

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    const CardMixin = CardMixinFactory({
        fields: {},
        additionalMapFunc: _buildHeadingMap
    });

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'EventInfoCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AddressMixin, AutoShouldUpdateMixin, CardMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event,
                speakerInfo
            } = this.props;

            const modifiedEvent = event.get('modifiedEvent');
            const organization = modifiedEvent.get('organization');
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');

            const status = modifiedEvent.get('status');

            let subHeadingCollection;

            let headingMap = this.buildHeadingMap({
                record: fromJS(_.assign(modifiedEvent.toJS(), selectedSpeaker.toJS())),
                inst: this
            });

            let mapKeys = [
                'strdate',
                'address',
                'deliveryMethod',
                (determineMsm(speakerInfo) ? 'speaker' : null)
            ];

            subHeadingCollection = this.extractHeadings(headingMap, mapKeys);

            // Wait for event to be fully loaded before displaying partial data
            if (modifiedEvent.size === 1) {
                subHeadingCollection = [];
            }

            return (
                <div style={{
                    backgroundColor: mainTheme.darkBackgroundColor,
                    minHeight: '80px',
                    color: 'white',
                    display: 'flex',
                    padding: '10px'
                }}>

                    <div style={{
                        order: 1
                    }}>
                        {_generateAvatar(this)}
                    </div>

                    <div style={{
                        order: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 1,
                        flexGrow: 1
                    }}>

                        <div style={{
                            order: 1,
                            paddingTop: '5px',
                            paddingLeft: '5px',
                            fontWeight: 'bold'
                        }}>
                            {organization}
                        </div>

                        <div style={{
                            order: 2,
                            display: 'flex',
                            paddingTop: '10px',
                            paddingLeft: '5px'
                        }}>

                            <div style={{
                                order: 1,
                                flexGrow: 1,
                                fontSize: '12px',
                                color: '#87c5ff',
                                fontWeight: 'bold'
                            }}>
                                {_.map(subHeadingCollection, (s, i) => {
                                    return <div key={i} style={{
                                        marginTop: '2px',
                                        marginBottom: '2px'
                                    }}>
                                        <IconLabel fontSize="12px" color="#87c5ff" iconClass={s.iconClass}
                                                   label={s.subHeading}/>
                                    </div>;
                                })}
                            </div>

                            <div style={{
                                order: 2,
                                textAlign: 'right',
                                color: _determineStatusColor(this),
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {status && status.toUpperCase()}
                            </div>

                        </div>

                        <div style={{
                            order: 3
                        }}></div>

                    </div>

                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { EventInfoCardFactory }