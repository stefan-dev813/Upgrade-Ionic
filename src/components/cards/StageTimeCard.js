/**
 * Creates and StageTimeCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const StageTimeCardFactory = (spec) => {

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
    const moment = require('moment');

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});
    const {
        log
    } = require('../../util/DevTools').default;
    const DateTools = require('../../util/DateTools').default({});
    const {
        isSolutionTree
    } = require('../../util/Platform').default;

    // Actions
    const {
        EventActionsFactory,
        StageTimeActionsFactory,
        TranslateActionsFactory,
        VenueActionsFactory
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
        isMarketPlaceEvent,
        stopProp
    } = EventActionsFactory({});
    const {
        deleteStageTime,
        selectStageTime
    } = StageTimeActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        extractSelectedVenue
    } = VenueActionsFactory({});


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
        const {dispatch, stageTime} = inst.props;

        dispatch(deleteStageTime({
            id: stageTime.get('id')
        }));
    };

    /**
     *
     * @param inst
     * @private
     */
    _editHandler = (inst) => {
        const {dispatch, stageTime} = inst.props;

        dispatch(selectStageTime({
            id: stageTime.get('id')
        }));
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
            showDetails: PropTypes.bool,
            stageTime: PropTypes.object.isRequired
        },
        propsPriority: [
            'showDetails',
            'stageTime',
            'event'
        ],
        compareState: true
    });

    const CardMixin = CardMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'StageTimeCard',
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
                stageTime,
                event
            } = this.props;

            const showDetails = (this.props.showDetails === true || this.state.showDetails === true);

            let stageDate = convertFromBalboaTrunkTimestamp(stageTime.get('starttime'));
            let formattedDate = esUtils.format_date(stageDate, esUtils.format_date.masks.mediumDate);
            let description = stageTime.get('description');
            const modifiedEvent = event.get('modifiedEvent');
            const isPersonal = modifiedEvent.get('isPersonal');

            let subHeadingCollection = [];

            // we need to get the venue first
            const venue = extractSelectedVenue(event, stageTime.get('venueid'));

            if (venue) {
                let addressString = this.buildLocationString(venue.toJS());

                if (!_.isEmpty(addressString)) {
                    subHeadingCollection.push({
                        subHeading: addressString,
                        iconClass: 'fa-map-marker'
                    });
                }
            }


            if (showDetails) {
                if (!_.isEmpty(stageTime.get('room'))) {
                    subHeadingCollection.push({
                        subHeading: getText('Room: %1$s', {
                            params: [stageTime.get('room')]
                        })
                    });
                }

                const avchecktime = stageTime.get('avchecktime');
                let avDate = null;
                if (_.isDate(avchecktime) || _.isNumber(avchecktime)) {

                    avDate = DateTools.convertFromBalboaTrunkTimestamp(avchecktime);

                    let formattedAvChecktime = moment(avDate).format(DateTools.masks.DATE_TIME_STRING);

                    subHeadingCollection.push({
                        subHeading: getText('A/V: %1$s', {
                            params: [formattedAvChecktime]
                        }),
                        iconClass: 'fa-calendar'
                    });
                }
            }

            let menuItems = this.getMenuItems(
                ['edit', 'delete'],
                {
                    onEdit: () => {
                        _editHandler(this);
                    },
                    onDelete: () => {
                        _deleteHandler(this);
                    }
                },
                this
            );

            if ((isSolutionTree() && isPersonal === false)
                || isMarketPlaceEvent(event.modifiedEvent)) {
                menuItems = this.getMenuItems(
                    ['expand'],
                    {},
                    this
                );
            }

            return <ListCard
                leftAvatarIcon='perm-contact-calendar'
                menuItems={menuItems}
                primaryText={description}
                secondaryText={_.concat([formattedDate], _.flatMap(subHeadingCollection, (s) => {
                    return s.subHeading;
                }))}
                onClick={(e) => {
                    stopProp(e);

                    if (!isSolutionTree() || (isSolutionTree() && isPersonal)) {
                        _editHandler(this);
                    }
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StageTimeCardFactory }