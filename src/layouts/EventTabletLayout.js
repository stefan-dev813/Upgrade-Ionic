/**
 * Creates a EventTabletLayout component
 *
 * @param {object} spec
 * @constructor
 * @returns {*}
 * @mixes AutoShouldUpdateMixin
 */
const EventTabletLayoutFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     ******************************************************************************/

        // NPM
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {connect} = require('react-redux');
    const Hammer = require('react-hammerjs');

    // Theme
    const mainTheme = require('../theme/mainTheme').default;

    // Components
    const {
        HeaderFactory,
        FooterNavFactory
    } = require('../components');

    const {MUIDrawerFactory} = require('../components/mui/MUIDrawer');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Actions
    const {
        NavActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

        //---------------------------------
        // Actions
        //---------------------------------

    const {
            nextEventView,
            prevEventView
        } = NavActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _swipeHandler;

    /**
     *
     * @param event
     * @param inst
     * @private
     */
    _swipeHandler = (event, inst) => {
        const {
            dispatch
        } = inst.props;

        if (event.deltaX < -50) {
            dispatch(nextEventView());
        } else if (event.deltaX > 50) {
            dispatch(prevEventView());
        }
    };

    /**********************************
     * Components
     *********************************/

    const Header = HeaderFactory({});
    const FooterNav = FooterNavFactory({});

    const MUIDrawer = MUIDrawerFactory({});

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
        displayName: 'EventMobileLayout',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Builds the virtual DOM/HTml
         *
         * @returns {*}
         */
        render() {
            const {
                children
            } = this.props;

            return (
                <div style={{
                    height: '100%'
                }}>

                    {/* Header */}

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0
                    }}>
                        <Header includeDrawer={false}/>
                    </div>

                    {/* Content */}

                    <div style={{
                        position: 'absolute',
                        top: '56px',
                        left: 0,
                        right: 0,
                        bottom: '56px'
                    }}>

                        {/* Left Content */}

                        <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                            width: '256px',
                            borderRight: `1px solid ${mainTheme.backgroundColor}`,
                            height: '100%'
                        }}>

                            <MUIDrawer staticLayout={true}/>

                        </div>

                        {/* Right Content */}

                        <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: '258px',
                            right: 0,
                            height: '100%',
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                            marginBottom: '60px'
                        }}>
                            <div>
                                <Hammer onSwipe={(e) => {
                                    _swipeHandler(e, this);
                                }}>

                                    {children}

                                </Hammer>

                                <div style={{height: '48px'}}></div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}>
                        <FooterNav includeSearch={false}/>
                    </div>

                </div>
            );
        }
    });

    return connect()(component);
}

export default EventTabletLayoutFactory;
