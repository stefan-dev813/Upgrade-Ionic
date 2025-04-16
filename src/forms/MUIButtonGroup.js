/**
 * Creates a React ButtonGroup Component
 * @param {object} spec - Collection of all named parameters
 *
 * @return {object} - React Component
 */
const MUIButtonGroupFactory = (spec) => {

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
    const {createElement} = React;

    // Material UI
    const RaisedButton = require('material-ui/RaisedButton').default;

    // Theme
    const mainTheme = require('../theme/mainTheme').default;

    // Enums
    const BTN = require('../enums/BTN').default;

    // Actions
    const {EventActionsFactory, TranslateActionsFactory} = require('../actions');

    // Utilities
    const {log} = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {stopProp} = EventActionsFactory({});
    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _processButton;

    /**
     * Builds the button's properties depending on it's type
     *
     * @param {object} button
     *
     * @return {object}
     */
    _processButton = (button, i) => {

        const {primary, secondary} = button.props;

        let props = _.assign({
            key: `button-${i}`,
            fullWidth: true,
            type: button.type || 'button'
        }, button.props, {
            primary: false,
            secondary: false
        });

        if (primary) {
            props = _.assign(props, {
                backgroundColor: mainTheme.primaryColor,
                labelColor: mainTheme.foregroundColor
            });
        }

        switch (props.action) {
            case BTN.SUBMIT:
                props.label = props.label || getText('Save');
                break;
            case BTN.CANCEL:
                props.label = props.label || getText('Cancel');
                break;
            case BTN.DELETE:
                props.label = props.label || getText('Delete');
                break;
            case BTN.DISCARD:
                props.label = props.label || getText('Discard Changes');
                break;
        }

        return createElement(RaisedButton, props);
    };

    /**************************************************************************
     *
     * React/Public
     *
     *************************************************************************/
    return createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'MUIButtonGroup',

        /**
         * Specifies what properties we are expecting in this.props
         */
        propTypes: {
            buttons: PropTypes.array.isRequired
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {buttons} = this.props;

            return <div className='mui-btn-group'>
                {(_.map(buttons, (button, i) => {
                    return _processButton(button, i);
                }))}
            </div>;
        }
    });
}

export default MUIButtonGroupFactory;