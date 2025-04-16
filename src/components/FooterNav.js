/**
 * Generates a FooterNav component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const FooterNavFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        is
    } = require('immutable');
    const {
        connect
    } = require('react-redux');

    // Components
    const BottomNavigation = require('material-ui/BottomNavigation').BottomNavigation;
    const Paper = require('material-ui/Paper').default;
    const FontIcon = require('material-ui/FontIcon').default;

    const {FooterNavItemFactory} = require('./FooterNavItem');
    const {FooterMessageInputFactory} = require('./FooterMessageInput');

    const mainTheme = require('../theme/mainTheme').default;

    // Enums
    const VIEWS = require('../enums/VIEWS').default;

    // Factories
    const {AutoShouldUpdateMixinFactory} = require('../mixins');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        DialogActionsFactory,
        NavActionsFactory,
        SearchActionsFactory
    } = require('../actions');

    const {
        isPhone,
        getBalboaUrl
    } = require('../util/Platform').default;


    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Variables
    //---------------------------------

    let jobMessage = null;

    //---------------------------------
    // Factories
    //---------------------------------

    const {showConfirmedEventsDialog, showJobBoardMovedDialog} = DialogActionsFactory();

    const {checkForDirty, changeMainView, getCurrentSubView} = NavActionsFactory({});

    const {
        autoSearch
    } = SearchActionsFactory({});

    const FooterNavItem = FooterNavItemFactory({});
    const FooterMessageInput = FooterMessageInputFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _determineSelected;
    let _onMainNavChange;

    /**
     *
     * @param view
     * @returns {number}
     * @private
     */
    _determineSelected = (view, includeSearch) => {
        if(_.includes(VIEWS.jobViews, view)) {
            view = VIEWS.mainViews.JOBS_VIEW;
        }

        return _.indexOf(VIEWS.getFooterNavItems(includeSearch), view);
    };

    /**
     * Changes the top level view
     *
     * @param {string} newView
     * @param {object} inst - Reference to the React Component
     * @private
     */
    _onMainNavChange = (newView, inst) => {
        inst = inst || this;

        const {
            dispatch
        } = inst.props;

        if(newView.id === VIEWS.mainViews.JOBS_VIEW.id) {
            // display a menu
        }

        checkForDirty(_.assign(_.pick(inst.props, ['dispatch', 'event', 'view']), {
            changeViewCallback: () => {
                dispatch(changeMainView(newView));
            }
        }));
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            includeSearch: PropTypes.bool.isRequired,
            auth: PropTypes.object.isRequired,
            browser: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired
        },
        propsPriority: [
            'includeSearch',
            'nav',
            'view',
            'event',
            'jobBoard',
            'speakerInfo',
            'browser'
        ]
    });

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'FooterNav',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getDefaultProps() {
            return {
                includeSearch: true
            };
        },

        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            let {
                includeSearch,
                nav,
                view,
                auth,
                speakerInfo,
                jobBoard,
                dispatch,
                browser
            } = this.props;

            const keyboardActive = view.get('keyboardActive');

            const currentView = nav.get('mainView');
            const currentSubView = getCurrentSubView(nav);

            let footerItems = VIEWS.getFooterNavItems(includeSearch);

            if(currentSubView && currentSubView.id === VIEWS.jobSubViews.JOB_MESSAGES_VIEW.id) {
                return (
                    <div className='footer-nav'>
                        <Paper zDepth={1} style={{
                            padding: 5
                        }}>
                            <FooterMessageInput/>
                        </Paper>
                    </div>
                );
            }

            if (keyboardActive) {
                return <div></div>;
            }

            return <div className='footer-nav'>
                <Paper zDepth={1}>
                    <BottomNavigation
                        selectedIndex={_determineSelected(currentView, includeSearch)}>

                        {_.map(footerItems, (navItem, i) => {
                            return <FooterNavItem
                                speakerInfo={speakerInfo}
                                jobBoard={jobBoard}
                                key={`footer-nav-item-${i}`}
                                viewItem={navItem}
                                iconClass={navItem.iconClass}
                                onClick={(childNavItem) => {
                                    const currentNavItem = childNavItem || navItem;

                                    if(currentNavItem.id === VIEWS.jobViews.CONFIRMED_EVENTS_VIEW.id) {
                                        dispatch(showConfirmedEventsDialog({
                                            onContinue: () => {
                                                dispatch(autoSearch({
                                                    marketplaceOnly: true,
                                                    futureOnly: true
                                                }));

                                                if (isPhone(browser)) {
                                                    dispatch(changeMainView(VIEWS.mainViews.SEARCH_VIEW));
                                                }
                                            }
                                        }));
                                    } else if (currentNavItem.id === VIEWS.jobViews.JOB_BOARD_VIEW.id) {
                                        dispatch(showJobBoardMovedDialog({
                                            onContinue: (e) => {
                                                e.preventDefault();
                                                window.open(`${getBalboaUrl()}/oauth2/authviaestoken?estoken=${auth.get('sessionData').get('token')}&redir=/dashboard/${speakerInfo.get('selectedSpeaker').get('sid')}/lead-board/job-board`, '_system')
                                            }
                                        }));
                                    // } else if (currentNavItem.id === VIEWS.jobViews.LEADS_OFFERS_VIEW.id) {
                                    //     dispatch(showJobBoardMovedDialog({
                                    //         onContinue: (e) => {
                                    //             e.preventDefault();
                                    //             window.open(`${getBalboaUrl()}/oauth2/authviaestoken?estoken=${auth.get('sessionData').get('token')}&redir=/dashboard/${speakerInfo.get('selectedSpeaker').get('sid')}/lead-board/shortlists`, '_system')
                                    //         }
                                    //     }));
                                    } else {
                                        _onMainNavChange(currentNavItem, this);
                                    }
                                }}
                            />;
                        })}

                    </BottomNavigation>
                </Paper>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { FooterNavFactory }