/**
 * Creates and ContactCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const ContactCardFactory = (spec) => {

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
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        ContactActionsFactory,
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
        deleteContact,
        selectContact
    } = ContactActionsFactory({});
    const {
        toggleEventDirty,
        stopProp
    } = EventActionsFactory({});
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
     * @returns {{}}
     * @private
     */
    _buildHeadingMap = (spec) => {
        let map = {};
        let inst = spec.inst;
        let contact = spec.record;

        let addressString = inst.buildLocationString(contact.toJS());

        if (!_.isEmpty(addressString)) {
            map['address'] = {
                subHeading: addressString,
                iconClass: 'fa-map-marker'
            };
        }

        return map;
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _deleteHandler = (inst) => {
        const {
            contact,
            dispatch
        } = inst.props;

        dispatch(toggleEventDirty(true));

        dispatch(deleteContact({
            id: contact.get('id')
        }));
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _editHandler = (inst) => {
        const {
            contact,
            dispatch
        } = inst.props;

        dispatch(selectContact({
            id: contact.get('id')
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
            contact: PropTypes.object.isRequired,
            showDetails: PropTypes.bool
        },
        propsPriority: [
            'showDetails',
            'contact',
            'event'
        ],
        compareState: true
    });

    const CardMixin = CardMixinFactory({
        fields: [{
            key: 'title',
            iconClass: ''
        }, {
            key: 'email',
            iconClass: 'fa-envelope-o'
        }, {
            key: 'phone',
            iconClass: 'fa-phone'
        }, {
            key: 'mobile',
            iconClass: 'fa-mobile'
        }, {
            key: 'company',
            iconClass: 'fa-building'
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
        displayName: 'ContactCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AddressMixin, AutoShouldUpdateMixin, CardMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                contact,
                showDetails
            } = this.props;

            let dataId = contact.get('id');
            let name = contact.get('cname');

            let subHeadingCollection = [];

            let headingMap = this.buildHeadingMap({
                record: contact,
                inst: this
            });

            if (!showDetails) {
                // determine slot 3 based on a priority
                subHeadingCollection = this.extractHeadings(headingMap, [
                    'email',
                    'phone',
                    'mobile',
                    'company',
                    'title',
                    'address'
                ], 3);
            }
            else {
                // if we are showing details then change the priorities
                // and remove 3 line limit
                subHeadingCollection = this.extractHeadings(headingMap, [
                    'company',
                    'title',
                    'email',
                    'phone',
                    'mobile',
                    'fax',
                    'address'
                ]);
            }

            let subHeadingOne = '';
            if (subHeadingCollection && subHeadingCollection.length) {
                subHeadingOne = subHeadingCollection[0].subHeading;
            }

            const groupCodes = contact.get('groupcodes');

            let groupCode;

            if (groupCodes) {
                groupCode = groupCodes.first();
            }

            const menuItems = this.getMenuItems(['expand', 'edit', 'delete'], {
                onEdit: () => {
                    _editHandler(this);
                },
                onDelete: () => {
                    _deleteHandler(this);
                }
            }, this);

            return <ListCard
                leftAvatarText={groupCode || ' '}
                menuItems={menuItems}
                primaryText={name}
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

export { ContactCardFactory }