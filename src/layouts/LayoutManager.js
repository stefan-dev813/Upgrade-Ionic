/**
 * Creates a LayoutManager component
 *
 * @param {object} spec
 * @constructor
 * @returns {*}
 * @mixes AutoShouldUpdateMixin
 */
const LayoutManagerFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     ******************************************************************************/

    /* global navigator */

    // NPM
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');
    const {
        is
    } = require('immutable');
    // Enums
    const VIEWS = require('../enums/VIEWS').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Layouts
    const {
        EventMobileLayoutFactory,
        EventTabletLayoutFactory,
        MainMobileLayoutFactory,
        MainTabletLayoutFactory
    } = require('./');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;

    const Platform = require('../util/Platform').default;

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

        //---------------------------------
        // Actions
        //---------------------------------

    const {
            stopProp
        } = EventActionsFactory({});

    const {
        getCurrentSubView
    } = NavActionsFactory();

    /**********************************
     * Layouts
     *********************************/

    const EventMobileLayout = EventMobileLayoutFactory({});
    const EventTabletLayout = EventTabletLayoutFactory({});
    const MainMobileLayout = MainMobileLayoutFactory({});
    const MainTabletLayout = MainTabletLayoutFactory({});

    /**********************************
     * Methods
     *********************************/

    let _determineLayout;

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _determineLayout = (inst) => {
        const {
            browser,
            children,
            nav,
            shelfChangeHandler
        } = inst.props;

        if (getCurrentSubView(nav) || nav.get('eventView')) {
            if (Platform.isTablet(browser)) {
                return <EventTabletLayout>{children}</EventTabletLayout>;
            }
            else {
                return <EventMobileLayout shelfChangeHandler={shelfChangeHandler}>{children}</EventMobileLayout>;
            }
        } else if (nav.get('mainView')) {
            const currentMainView = nav.get('mainView');
            if (Platform.isTablet(browser)) {
                return <MainTabletLayout hide_search={is(currentMainView.get('id'), VIEWS.mainViews.SEARCH_VIEW.get('id'))}>{children}</MainTabletLayout>;
            }
            else {
                return <MainMobileLayout>{children}</MainMobileLayout>;
            }
        } else {
            if (Platform.isTablet(browser)) {
                return <MainTabletLayout>{children}</MainTabletLayout>;
            }
            else {
                return <MainMobileLayout>{children}</MainMobileLayout>;
            }
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            browser: PropTypes.object.isRequired,
            children: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            shelfChangeHandler: PropTypes.func.isRequired,
            loading: PropTypes.object.isRequired,
            overlay: PropTypes.object.isRequired
        }
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
        displayName: 'LayoutManager',
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
                overlay
            } = this.props;

            return <div style={{
                height: '100%'
            }}>

                {(overlay && overlay.get('show')) ? <div className={`overlay ${overlay.get('mode')}`}
                                                         onClick={(e) => {
                                                             stopProp(e);

                                                             overlay.get('onClick')();
                                                         }}></div> : null}

                {_determineLayout(this)}


            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export default LayoutManagerFactory;
