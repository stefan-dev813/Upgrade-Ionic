/**
 * Creates an DrawerHeaderCard React Component
 *
 * @constructor
 * @param {object} spec - Collection of named parameters
 *
 * @return {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const DrawerHeaderCardFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/


        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');const PropTypes = require('prop-types');
    const {
        fromJS
    } = require('immutable');
    const {
        connect
    } = require('react-redux');

    // enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;

    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    const {MultiLineSecondaryTextFactory} = require('./MultiLineSecondaryText');

    const {BaseHeaderCardFactory} = require('./BaseHeaderCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        AddressMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        SpeakerInfoActionsFactory
    } = require('../../actions');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        determineMsm
    } = SpeakerInfoActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const BaseHeaderCard = BaseHeaderCardFactory({});
    const MultiLineSecondaryText = MultiLineSecondaryTextFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildHeadingMap;
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
                iconClass: 'fa-calendar-o'
            };
        }

        venues = record.get('Venue');

        if (venues && venues.size >= 1) {
            let addressString = inst.buildLocationString(venues.first().toJS(), ['city', 'st']);
            if (!_.isEmpty(addressString)) {
                map['address'] = {
                    subHeading: addressString,
                    iconClass: 'fa-map-marker'
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
            iconClass: 'fa-user'
        };

        return map;
    };

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {
            event,
            speakerInfo
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const organization = modifiedEvent.get('organization');
        const deliveryMethod = modifiedEvent.get('deliveryMethod') || 'none';
        const status = modifiedEvent.get('status');

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;
        let bgColor;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        bgColor = mainTheme.getStatusColor(status) || mainTheme[`${status}Color`];

        return <Avatar
            backgroundColor={bgColor}
            icon={avIcon}/>;
    };

    /**********************************
     * Mixins
     *********************************/

    const AddressMixin = AddressMixinFactory({});

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            theme: PropTypes.oneOf(['drawer', 'form'])
        }
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'organization',
            iconClass: ''
        }],
        additionalMapFunc: _buildHeadingMap
    });

    /******************************************************************************
     *
     * React / Public Interface
     *
     *****************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'DrawerHeaderCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AddressMixin, AutoShouldUpdateMixin, CardMixin],
        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                theme: 'form'
            };
        },
        /**
         * Generates HTML/DOM
         *
         * @return {JSX|XML}
         */
        render() {
            const {
                event,
                speakerInfo,
                theme
            } = this.props;

            const modifiedEvent = event.get('modifiedEvent');
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const organization = modifiedEvent.get('organization');
            const deliveryMethod = modifiedEvent.get('deliveryMethod') || 'none';

            let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod.toString()] || DELIVERY_METHOD_ICONS['0'];
            const status = modifiedEvent.get('status');

            let subHeadingCollection;

            let headingMap = this.buildHeadingMap({
                record: fromJS(_.assign(modifiedEvent.toJS(), selectedSpeaker.toJS())),
                inst: this
            });

            let mapKeys = [
                'strdate',
                (dmIcon.label === DELIVERY_METHOD_ICONS['1'].label ? 'address' : 'deliveryMethod'),
                (determineMsm(speakerInfo) ? 'speaker' : null)
            ];

            const baseTextStyle = {
                width: '183px'
            };

            let appliedTextStyle = _.assign({}, baseTextStyle);

            subHeadingCollection = this.extractHeadings(headingMap, mapKeys);

            if(theme === 'form') {
                appliedTextStyle = _.assign(appliedTextStyle, {
                    color: mainTheme.fontColor,
                    width: 'inherit',
                    whiteSpace: 'normal'
                });
            }

            return <BaseHeaderCard
                leftAvatar={_generateAvatar(this)}
                heading={organization || ''}
                subHeading={_.flatMap(subHeadingCollection, (s) => {
                    return s.subHeading;
                })}
                headingStyle={appliedTextStyle}
                subHeadingStyle={appliedTextStyle}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DrawerHeaderCardFactory }