/**
 * Creates and ServiceCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const ServiceCardFactory = (spec) => {

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
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;
    const DateTools = require('../../util/DateTools').default({});
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        ServiceActionsFactory,
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
        deleteService,
        selectService
    } = ServiceActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildHeadingMap;
    let _deleteHandler;
    let _editHandler;

    /**
     *
     * @param {object} spec
     * @property {Record} spec.record
     * @property {object} spec.inst
     * @property {object} spec.map
     * @param inst
     * @returns {object}
     * @private
     */
    _buildHeadingMap = (spec) => {
        let map = spec.map || {};
        const service = spec.record;

        let due = service.get('due');
        const flagList = service.get('flags_as_map');

        if (_.isDate(due) || (_.isNumber(due) && due > 0)) {
            let dueDate = DateTools.convertFromBalboaTrunkTimestamp(due);

            let formattedDueDate = moment(dueDate).format(DateTools.masks.DATE_STRING);

            map['due'] = {
                subHeading: getText('Due: %1$s', {
                    params: [formattedDueDate]
                }),
                iconClass: 'fa-calendar'
            };
        }

        if (flagList && flagList.size) {
            flagList.map((flag, key) => {
                if (key === 'bill_later') {
                    if (flag.get('is_set')) {
                        if (_.has(map, 'amount')) {
                            map['amount'].subHeading = getText('Actual');
                        }

                        if (_.has(map, 'fee')) {
                            map['fee'].subHeading = getText('Actual');
                        }
                    }
                }

                if (key === 'free') {
                    if (flag.get('is_set')) {
                        if (_.has(map, 'amount')) {
                            map['amount'].subHeading = getText('Free');
                        }

                        if (_.has(map, 'fee')) {
                            map['fee'].subHeading = getText('Free');
                        }
                    }
                }
            });
        }

        return map;
    };

    /**
     *
     * @param inst
     * @private
     */
    _deleteHandler = (inst) => {
        const {
            dispatch,
            service
        } = inst.props;

        dispatch(toggleEventDirty(true));

        dispatch(deleteService({
            id: service.get('id')
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
            service
        } = inst.props;

        dispatch(selectService({
            id: service.get('id')
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
            service: PropTypes.object.isRequired,
            showDetails: PropTypes.bool
        },
        propsPriority: [
            'showDetails',
            'service'
        ],
        compareState: true
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'description',
            iconClass: ''
        }, {
            key: 'fee',
            labelFunc: (value) => {
                return esUtils.format_currency(value, 2);
            }
        }, {
            key: 'amount',
            labelFunc: (value) => {
                return esUtils.format_currency(value, 2);
            }
        }],
        additionalMapFunc: _buildHeadingMap
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
        displayName: 'ServiceCard',
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
                service
            } = this.props;

            const showDetails = (this.props.showDetails || this.state.showDetails);

            let subHeadingCollection;

            let headingMap = this.buildHeadingMap({
                record: service,
                inst: this
            });

            subHeadingCollection = this.extractHeadings(headingMap, [
                'description',
                'due',
                'fee',
                'amount'
            ]);

            let heading = '';
            if (subHeadingCollection && subHeadingCollection.length) {
                heading = subHeadingCollection.shift().subHeading;
            }

            const groupCode = service.get('groupcode');

            const menuItems = this.getMenuItems(['edit', 'delete'], {
                onEdit: () => {
                    _editHandler(this);
                },
                onDelete: () => {
                    _deleteHandler(this);
                }
            }, this);

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

export { ServiceCardFactory }