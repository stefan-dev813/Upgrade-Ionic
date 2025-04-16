/**
 * Generates a MUIIconInput component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MUIIconInputFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // components
    const MenuItem = require('material-ui/MenuItem').default;

    const IconMap = require('../../theme/IconMap');

    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    /**********************************
     * Methods
     *********************************/

    let _buildIcon;

    /**
     *
     * @param field
     * @returns {*}
     * @private
     */
    _buildIcon = (field) => {
        if (_.has(field, 'iconMailTo') && !_.isEmpty(field.iconMailTo)) {
            return <a href={`mailto: ${field.iconMailTo}`}>{IconMap.getFormIcon(field.iconClass)}</a>;
        }

        if (_.has(field, 'iconTel') && !_.isEmpty(field.iconTel)) {
            return <a href={`tel: ${field.iconTel}`}>{IconMap.getFormIcon(field.iconClass)}</a>;
        }

        if (_.has(field, 'iconLink') && !_.isEmpty(field.iconLink)) {
            return <a href={`${field.iconLink}`}>{IconMap.getFormIcon(field.iconClass)}</a>;
        }

        return IconMap.getFormIcon(field.iconClass);
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            field: PropTypes.object.isRequired,
            children: PropTypes.node.isRequired
        }
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
        displayName: 'MUIIconInput',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            let {field, children} = this.props;

            if (field.icon === false) {
                return children;
            }

            const baseStyle = {
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '8px',
                paddingBottom: '8px',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start'
            };

            let appliedStyle = _.assign({}, baseStyle);

            if (field.type === 'hidden') {
                appliedStyle = _.assign(appliedStyle, {
                    display: 'none'
                });
            }

            return (
                <div style={appliedStyle}>

                    <div style={_.assign({
                        order: 1,
                        width: '56px'
                    }, (field.showIcon === false ? {width: '8px'} : null))}>
                        {_buildIcon(field)}
                    </div>

                    <div style={{
                        order: 2,
                        flexGrow: 1
                    }}>
                        {children}
                    </div>

                </div>
            );
        }
    });
}

const component = MUIIconInputFactory({});

export default {
    component,
    MUIIconInputFactory
}