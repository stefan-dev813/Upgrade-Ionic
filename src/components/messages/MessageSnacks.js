/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 */
const MessageSnacksFactory = (spec) => {

    //-------------------------------------------------------------------------
    //
    // Imports
    //
    //-------------------------------------------------------------------------

    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const Snackbar = require('material-ui/Snackbar').default;

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../../mixins/AutoShouldUpdateMixin').default;

    // Actions
    const {
        EventActionsFactory,
        MessageActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    //-------------------------------------------------------------------------
    //
    // Private Members
    //
    //-------------------------------------------------------------------------

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});
    const {
        clearMessages
    } = MessageActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _determineStyle;

    /**
     *
     * @param message
     * @returns {object}
     * @private
     */
    _determineStyle = (message) => {
        let style = {};

        if (!message)
            return style;

        let type = message.get('type');

        if (type === 'info') {
            style = {
                color: mainTheme.infoBackgroundColor
            };
        } else if (type === 'error') {
            style = {
                color: mainTheme.errorBackgroundColor
            };
        } else if (type === 'warning') {
            style = {
                color: mainTheme.warningBackgroundColor
            };
        } else if (type === 'success') {
            style = {
                color: mainTheme.successBackgroundColor
            };
        }

        return style;
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            messages: PropTypes.object.isRequired
        }
    });

    //-------------------------------------------------------------------------
    //
    // Public Interface
    //
    //-------------------------------------------------------------------------

    let component = createClass({
        render() {
            const {dispatch, messages} = this.props;

            let message = messages.first();

            if (!message)
                return <div></div>;

            let bgColor = 'white';

            return <Snackbar
                className='message-snack'
                message={<div>
                    <div style={_.assign(_determineStyle(message), {
                        fontWeight: 'bold',
                        fontSize: '14px'
                    })}>{message.get('type').toUpperCase()}</div>
                    <div style={{
                        maxHeight: '128px',
                        overflow: 'scroll',
                        lineHeight: 1.5
                    }}>
                        {message.get('text')}
                    </div>
                </div>}
                style={{
                    backgroundColor: bgColor,
                    height: 'auto',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                    bottom: '100px'
                }}
                contentStyle={{
                    backgroundColor: bgColor,
                    color: 'black',
                    height: 'auto'
                }}
                bodyStyle={_.assign(_determineStyle(message), {
                    backgroundColor: bgColor,
                    height: 'auto'
                })}
                open={(!!message)}
                autoHideDuration={7000}
                action={getText('OK').toUpperCase()}
                onRequestClose={(e) => {
                    dispatch(clearMessages());
                }}
                onActionTouchTap={(e) => {
                    dispatch(clearMessages());
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MessageSnacksFactory }