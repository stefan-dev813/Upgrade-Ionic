/**
 *
 * @param spec
 * @returns {XML}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MessageContainerFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const _ = require('lodash');

    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            text: PropTypes.string,
            type: PropTypes.string,
            boxStyle: PropTypes.object,
            textStyle: PropTypes.object,
            message: PropTypes.object,
            children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
        }
    });

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    return createClass({
        /**
         * Used in debug messages
         */
        displayName: 'MessageContainer',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         *
         */
        getBackgroundColor() {
            let type = this.getType();
            let bgColor = mainTheme.warningBackgroundColor;
            let dynamicBgColor = mainTheme[`${type}BackgroundColor`];

            return dynamicBgColor || mainTheme.warningBackgroundColor;
        },
        /**
         *
         */
        getType() {
           const {
               message,
               type
           } = this.props;

           if(message) {
               return message.get('type');
           }

           return type;
        },
        /**
         *
         */
        getText() {
            const {
                message,
                text
            } = this.props;

            if(message) {
                return message.get('text');
            }

            return text;
        },
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                message,
                text,
                type,
                boxStyle,
                textStyle,
                children
            } = this.props;

            // TODO: Change BG and Text Color based on 'type'
            let baseBoxStyle = {
                borderLeft: 'thick solid rgba(170,103,8,.2)',
                backgroundColor: 'rgba(252,163,8,.04)',
                margin: '10px',
                padding: '10px',
                color: 'rgba(170,103,8,.73)'
            };

            if(this.getType() === 'note') {
                baseBoxStyle = _.assign({}, baseBoxStyle, {
                    backgroundColor: 'rgba(255, 255, 224, 0.6)',
                    borderLeft: 'thick solid rgba(234, 222, 181, 0.8)',
                    color: mainTheme.fontColor
                });
            }

            if(this.getType() === 'info') {
                baseBoxStyle = _.assign({}, baseBoxStyle, {
                    backgroundColor: 'rgba(224, 240, 255, 0.6)',
                    borderLeft: 'thick solid rgba(181, 203, 234, 0.8)',
                    color: mainTheme.fontColor,
                    fontSize: 'smaller'
                });
            }

            let baseTextStyle = {

            };

            return (
                <div style={_.assign({}, baseBoxStyle, boxStyle)}>
                    {_.isEmpty(children) ? <span style={_.assign({}, baseTextStyle, textStyle)}>{this.getText()}</span> : children}
                </div>
            );
        }
    });
}

export { MessageContainerFactory }