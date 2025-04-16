/**
 *
 * @param spec
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobMessageCardFactory = (spec = {}) => {
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
    const moment = require('moment');

    const Chip = require('material-ui/Chip').default;
    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    const {
        TranslateActionsFactory
    } = require('../../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        getText
    } = TranslateActionsFactory();

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            msg: PropTypes.object.isRequired,
            senderName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
            isYou: PropTypes.bool.isRequired,
            lastItem: PropTypes.bool
        }
    });

    //=========================================================================
    //
    // Public Methods
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'JobMessageCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        scrollToBottom() {
            const {
                lastItem
            } = this.props;

            if (lastItem) {
                setTimeout(() => {
                    this.el.scrollIntoView({behaviour: 'smooth'});
                }, 125);
            }
        },
        componentDidMount() {
            this.scrollToBottom();
        },
        componentDidUpdate() {
            this.scrollToBottom();
        },
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                isYou,
                msg,
                senderName
            } = this.props;

            let is_unread = !isYou && !msg.receiver_opened;
            let created = new Date(_.get(msg, "created_ISO8601", null));

            const baseContainerStyle = {
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                margin: "10px 0px",
                marginLeft: 10,
                marginRight: 30,
                padding: 15
            };

            const messageStyle = {
                whiteSpace: 'pre-wrap'
            };

            const metaStyle = {
                color: mainTheme.mutedFontColor,
                textAlign: 'right',
                paddingBottom: 5,
                fontSize: '.8em'
            };

            let containerStyle = _.assign({}, baseContainerStyle, (isYou ? {
                background: '#F0F7FF',
                color: '#748AA4',
                borderColor: '#8099B8',
                marginLeft: 30,
                marginRight: 10
            } : null));

            return (
                <div style={containerStyle} ref={(el) => {
                    this.el = el;
                }}>
                    <div style={{
                        display: 'flex'
                    }}>
                        <div style={{
                            width: 55
                        }}>
                            {is_unread ? <Chip labelStyle={{
                                    lineHeight: '24px'
                                }}
                                                          backgroundColor={mainTheme.errorBackgroundColor}
                                                          labelColor={mainTheme.errorFontColor}>{getText("NEW")}</Chip>
                                : null}

                        </div>
                        <div style={_.assign({}, metaStyle, {
                            flexGrow: 1
                        })}>
                            <div style={{
                                fontStyle: 'italic'
                            }}>{moment(created).fromNow()}</div>
                            <div>{senderName}</div>
                        </div>
                    </div>


                    <div style={messageStyle}>
                        {msg.content}
                    </div>
                </div>
            );
        }
    });

    return component;
}

export { JobMessageCardFactory }