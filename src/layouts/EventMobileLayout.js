/**
 * Creates a EventMobileLayout component
 *
 * @param {object} spec
 * @constructor
 * @returns {*}
 * @mixes AutoShouldUpdateMixin
 */
const EventMobileLayoutFactory = (spec) => {
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
    const {
        connect
    } = require('react-redux');
    // const Hammer = require('react-hammerjs');

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
        EventActionsFactory,
        NavActionsFactory
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
        getCurrentSubView,
        // nextEventView,
        // prevEventView
    } = NavActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _determineShowDrawer;
    // let _swipeHandler;

    /**
     * Determines if we should show the Drawer navigation
     *
     * @param {object} inst
     * @returns {boolean}
     * @private
     */
    _determineShowDrawer = (inst) => {
        const {
            event,
            nav
        } = inst.props;

        const selectedEvent = event.get('selectedEvent');
        const subView = getCurrentSubView(nav);

        return (selectedEvent && !subView);
    };

    // /**
    //  *
    //  * @param event
    //  * @param inst
    //  * @private
    //  */
    // _swipeHandler = (event, inst) => {
    //     const {
    //         dispatch
    //     } = inst.props;
    //
    //     if (event.deltaX < -50) {
    //         dispatch(nextEventView());
    //     } else if (event.deltaX > 50) {
    //         dispatch(prevEventView());
    //     }
    // };

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
            children: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired
        },
        propsPriority: [
            'nav',
            'children',
            'event'
        ]
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
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
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>

                    {(_determineShowDrawer(this) ?
                      <MUIDrawer/> : null)}

                    <div style={{
                        order: 1,
                        flexBasis: 'auto',
                        flexShrink: 0,
                        flexGrow: 0
                    }}>
                        <Header/>
                    </div>

                    <div style={{
                        order: 2,
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        flexShrink: 1,
                        flexGrow: 1,
                        marginBottom: '60px'
                    }}>

                        <div>
                            {children}

                            <div style={{height: '48px'}}></div>
                        </div>
                    </div>

                    <div
                        className='hider'
                        onClick={(e) => {
                            stopProp(e);

                            this.refs.drawerNav.close();
                        }}/>

                    <div
                         style={{
                            order: 3,
                            flexBasis: 'auto',
                            flexShrink: 0,
                            flexGrow: 0
                    }}>
                        <FooterNav includeSearch={true}/>
                    </div>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export default EventMobileLayoutFactory;
