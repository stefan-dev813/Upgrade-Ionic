/**
 * Generates a CardMixin component.  For shared functionality between Card
 * components.
 *
 * @param {object} spec - Container for named parameters
 * @property {array} spec.fields - (optional) Collection of field objects you want to be auto-mapped
 * @property {function} spec.additionalMapFunc - (optional) Custom function for additional mapping
 * @returns {object}
 * @constructor
 * @mixin
 */
const CardMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const DateToolsFactory = require('../util/DateTools').default;

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

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

    const DateTools = DateToolsFactory({});

    /**********************************
     * Variables
     *********************************/

    let _fields = spec.fields;
    let _additionalMapFunc = spec.additionalMapFunc;

    /**********************************
     * Methods
     *********************************/

    let _buildDataItems;
    let _buildHeadingMap;
    let _buildMenuItem;
    let _buildMenuItems;
    let _extractHeadings;

    /**
     * Generates the dynamic data-* attributes based on provided props
     *
     * @param {object} props
     * @returns {object}
     * @private
     */
    _buildDataItems = (props) => {
        const {
            dataType,
            dataItems
        } = props;

        let dataTags = {};

        if (dataType) {
            dataTags['data-type'] = dataType;
        }

        if (dataItems && _.isArray(dataItems)) {
            _.each(dataItems, (data) => {
                dataTags = _.assign(dataTags, data);
            });
        }

        return dataTags;
    };

    /**
     *
     * @param {Record} record
     * @param {array} fields
     * @property {string} field.key
     * @property {string} field.iconClass
     * @property {boolean} field.isDate
     * @property {function} field.labelFunc - (optional) Function to return a custom label string
     * @property {function} field.emptyFunc - (optional) Function to do a custom empty check
     * @param {object} inst
     * @param {function} additionalMapFunc
     * @returns {object}
     * @private
     */
    _buildHeadingMap = (spec) => {
        let {
            record,
            fields,
            inst,
            additionalMapFunc
        } = spec;
        let map = {};
        let value;

        fields = fields || _fields;
        additionalMapFunc = additionalMapFunc || _additionalMapFunc;

        if (!fields) {
            return null;
        }

        _.map(fields, (field) => {
            value = record.get(field.key);

            let notEmpty = false;

            if (_.isFunction(field.emptyFunc)) {
                notEmpty = field.emptyFunc(value);
            }
            else {
                if (_.isNumber(value) && value > 0) {
                    notEmpty = true;
                }
                else if (_.isString(value) && value.length > 0) {
                    notEmpty = true;
                }
                else if (_.isDate(value)) {
                    notEmpty = true;
                }
                else {
                    notEmpty = !_.isEmpty(value);
                }
            }

            if (notEmpty) {

                if (field.isDate) {
                    value = DateTools.convertFromBalboaToDateString(value);
                }

                map[field.key] = {
                    subHeading: (field.labelFunc ? field.labelFunc(value) : value),
                    iconClass: field.iconClass
                };
            }
        });

        if (_.isFunction(additionalMapFunc)) {
            map = _.assign(map, additionalMapFunc({
                record: record,
                inst: inst,
                map: map
            }));
        }

        return map;
    };

    /**
     *
     * @param item
     * @param props
     * @returns {*}
     * @private
     */
    _buildMenuItem = (item, props, inst) => {
        if (item === 'expand') {
            if (inst.state.showDetails || inst.props.showDetails) {
                return {
                    label: getText('Collapse'),
                    leftIcon: 'expand-less',
                    onClick: (e) => {
                        stopProp(e);

                        inst.setState({
                            showDetails: false
                        });

                        if (_.isFunction(props.onCollapse)) {
                            props.onCollapse();
                        }
                    }
                };
            } else {
                return {
                    label: getText('Expand'),
                    leftIcon: 'expand-more',
                    onClick: (e) => {
                        stopProp(e);

                        inst.setState({
                            showDetails: true
                        });

                        if (_.isFunction(props.onExpand)) {
                            props.onExpand();
                        }
                    }
                };
            }
        } else if (item === 'edit') {
            return {
                label: getText('Edit'),
                leftIcon: 'edit',
                onClick: (e) => {
                    stopProp(e);

                    if (_.isFunction(props.onEdit)) {
                        props.onEdit();
                    }
                }
            };
        } else if (item === 'delete') {
            return {
                label: getText('Delete'),
                leftIcon: 'delete',
                onClick: (e) => {
                    stopProp(e);

                    if (_.isFunction(props.onDelete)) {
                        props.onDelete();
                    }
                }
            };
        }
    };

    /**
     *
     * @param items
     * @param props
     * @returns {Array}
     * @private
     */
    _buildMenuItems = (items, props, inst) => {
        let menuItems = [];
        let menuItem;

        _.each(items, (item) => {
            menuItem = _buildMenuItem(item, props, inst);

            if (menuItem) {
                menuItems.push(menuItem);
            }
        });

        return menuItems;
    };

    /**
     *
     * @param map
     * @param prioritizedFields
     * @param limit
     * @returns {Array}
     * @private
     */
    _extractHeadings = (map, prioritizedFields, limit) => {
        let count = 0;
        let headings = [];
        limit = limit || prioritizedFields.length;

        _.map(prioritizedFields, (field) => {
            if (_.has(map, field) && count < limit) {
                headings.push(map[field]);
                count += 1;
            }
        });

        return headings;
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        buildDataItems: _buildDataItems,
        buildHeadingMap: _buildHeadingMap,
        extractHeadings: _extractHeadings,
        getMenuItems: _buildMenuItems,

        getInitialState() {
            return {
                showDetails: false
            };
        },

        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                showDetails: false
            };
        }
    };
}

export default CardMixinFactory;