/**
 * Creates a MainMobileLayout component
 *
 * @param {object} spec
 * @constructor
 * @returns {*}
 * @mixes AutoShouldUpdateMixin
 */
const MainMobileLayoutFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     ******************************************************************************/

        // NPM
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    const {connect} = require('react-redux');

    // Components
    const {
        HeaderFactory,
        FooterNavFactory
    } = require('../components');

    // Mixins
    const AutoShouldUpdateMixinFactory = require('../mixins/AutoShouldUpdateMixin').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    /**********************************
     * Components
     *********************************/

    const Header = HeaderFactory({});
    const FooterNav = FooterNavFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            children: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    const component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'MainMobileLayout',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Builds the virtual DOM/Html
         *
         * @returns {*|XML|JSX}
         */
        render() {
            const {
                children
            } = this.props;

            return <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
                height: '100%'
            }}>
                <div style={{
                    order: 1,
                    flexBasis: 'auto',
                    flexShrink: 0,
                    flexGrow: 0
                }}>
                    <Header includeDrawer={false}/>
                </div>

                <div style={{
                    order: 2,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: '0px',
                    marginBottom: '100px',
                    // height: '100%'
                }}>
                    {children}
                </div>

                <div style={{
                    order: 3,
                    flexBasis: 'auto',
                    flexShrink: 0,
                    flexGrow: 0
                }}>
                    <FooterNav includeSearch={true}/>
                </div>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export default MainMobileLayoutFactory;
