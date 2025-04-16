const LegendCardFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            avatarSize: PropTypes.number,
            avatarStyle: PropTypes.object,
            primaryText: PropTypes.string.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messages
         */
        displayName: 'LegendCard',
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
            const {
                avatarSize,
                avatarStyle,
                primaryText
            } = this.props;

            return (
                <div style={{
                    display: 'flex'
                }}>

                    <div style={{
                        order: 1,
                        width: '56px',
                        height: '56px',
                        textAlign: 'center',
                        margin: 'auto'
                    }}>
                        <Avatar
                            size={avatarSize}
                            style={avatarStyle}/>
                    </div>

                    <div style={{
                        order: 2,
                        flexGrow: 1,
                        flexShrink: 1
                    }}>
                        {primaryText}
                    </div>

                </div>
            );
        }
    });
}

export { LegendCardFactory }