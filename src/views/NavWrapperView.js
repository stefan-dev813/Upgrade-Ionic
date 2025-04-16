/**
 * Handles the main view rendering and navigation
 *
 * @param spec - Container of named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioMixin
 * @mixes AutoShouldUpdateMixin
 */
const NavigatorFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    /* global navigator */

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

    // Enums
    const VIEWS = require('../enums/VIEWS').default;
    const RADIOS = require('../enums/RADIOS').default;

    // Factories
    const {
        MessageSnacksFactory
    } = require('../components/messages');
    const LayoutManagerFactory = require('../layouts/LayoutManager').default;
    const {DialogGroupFactory} = require('../components/dialogs/DialogGroup');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Radios
    const {
        radio,
        RadioMixin
    } = require('react-pubsub-via-radio.js');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Views
    const {
        CalendarViewFactory,
        DashboardViewFactory,
        NewEventViewFactory,
        SearchViewFactory,
        SettingsViewFactory
    } = require('./');

    const {
        ContactsViewFactory,
        CustomViewFactory,
        DetailsViewFactory,
        JobEventViewFactory,
        LibraryViewFactory,
        MiscViewFactory,
        ServicesViewFactory,
        TodoListViewFactory,
        TravelViewFactory
    } = require('./eventViews');

    const {
        ConfirmedEventsViewFactory,
        JobApplyViewFactory,
        JobApplyConfirmationViewFactory,
        JobBoardViewFactory,
        JobDetailViewFactory,
        JobMessagesViewFactory,
        LeadsOffersViewFactory,
        LeadOfferDetailViewFactory,
        PayoutDetailViewFactory
    } = require('./jobViews');

    const {
        AddNoteViewFactory,
        CalendarEventsViewFactory,
        ContactViewFactory,
        EmailCoworkersViewFactory,
        ProductViewFactory,
        ServiceViewFactory,
        StageTimeViewFactory,
        TodoViewFactory
    } = require('./subViews');

    // Actions
    const {
        NavActionsFactory,
        ViewActionsFactory
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
        changeEventView,
        changeMainView,
        getCurrentSubView
    } = NavActionsFactory({});

    const {
        clearSubmitForm
    } = ViewActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const TodoListView = TodoListViewFactory({});
    const CalendarView = CalendarViewFactory({});
    const ContactsView = ContactsViewFactory({});
    const CustomView = CustomViewFactory({});
    const DashboardView = DashboardViewFactory({});
    const DetailsView = DetailsViewFactory({});
    const JobEventView = JobEventViewFactory({});
    const LibraryView = LibraryViewFactory({});
    const MessageSnacks = MessageSnacksFactory({});
    const MiscView = MiscViewFactory({});
    const NewEventView = NewEventViewFactory({});
    const SearchView = SearchViewFactory({});
    const ServicesView = ServicesViewFactory({});
    const SettingsView = SettingsViewFactory({});
    const TravelView = TravelViewFactory({});

    const AddNoteView = AddNoteViewFactory({});
    const CalendarEventsView = CalendarEventsViewFactory({});
    const ContactView = ContactViewFactory({});
    const EmailCoworkersView = EmailCoworkersViewFactory({});
    const ProductView = ProductViewFactory({});
    const ServiceView = ServiceViewFactory({});
    const StageTimeView = StageTimeViewFactory({});
    const TodoView = TodoViewFactory({});

    // Job Views
    const ConfirmedEventsView = ConfirmedEventsViewFactory({});
    const JobApplyView = JobApplyViewFactory();
    const JobApplyConfirmationView = JobApplyConfirmationViewFactory();
    const JobBoardView = JobBoardViewFactory({});
    const JobDetailView = JobDetailViewFactory();
    const JobMessagesView = JobMessagesViewFactory();
    const LeadOfferDetailView = LeadOfferDetailViewFactory({});
    const LeadsOffersView = LeadsOffersViewFactory({});
    const PayoutDetailView = PayoutDetailViewFactory();

    const LayoutManager = LayoutManagerFactory({});
    const DialogGroup = DialogGroupFactory({});

    /**********************************
     * Variables
     *********************************/

    // constants
    const mainViewCycle = [
        VIEWS.mainViews.CALENDAR_VIEW,
        VIEWS.mainViews.DASHBOARD_VIEW,
        VIEWS.mainViews.SEARCH_VIEW,
        VIEWS.mainViews.NEW_EVENT_VIEW,
        VIEWS.mainViews.SETTINGS_VIEW
    ];

    const eventViewCycle = [
        VIEWS.eventViews.DETAILS_VIEW,
        VIEWS.eventViews.CONTACTS_VIEW,
        VIEWS.eventViews.TRAVEL_VIEW,
        VIEWS.eventViews.SERVICES_VIEW,
        VIEWS.eventViews.TODO_LIST_VIEW,
        VIEWS.eventViews.CUSTOM_VIEW,
        VIEWS.eventViews.LIBRARY_VIEW,
        VIEWS.eventViews.MISC_VIEW
    ];

    let _swipeEnabled = true;
    let _shelfOpened = false;

    /**********************************
     * Methods
     *********************************/

    let _determineNextView;
    let _determinePrevView;
    let _determineScroll;
    let _determineView;
    let _getCurrentViewData;
    let _isSwipeNavEnabled;
    let _nextView;
    let _prevView;
    let _shelfChangeHandler;
    let _shouldShowMessages;
    let _swipeHandler;

    /**
     * Determines what view should be rendered next
     *
     * @param {object} inst - Reference to React Component
     * @return {string} - Next View
     * @private
     */
    _determineNextView = (inst) => {
        const {
            viewCycle,
            currentView
        } = _getCurrentViewData(inst);

        let i = _.indexOf(viewCycle, currentView);

        if (i < viewCycle.length - 1) {
            i += 1;
        }
        else {
            i = 0;
        }

        return viewCycle[i];
    };

    /**
     * Determines what view would come before the current
     *
     * @param {object} inst - Reference to React Component
     * @return {string} - Previous View
     * @private
     */
    _determinePrevView = (inst) => {
        const {
            viewCycle,
            currentView
        } = _getCurrentViewData(inst);

        let i = _.indexOf(viewCycle, currentView);

        i -= 1;

        if (i < 0) {
            i = viewCycle.length - 1;
        }

        return viewCycle[i];
    };

    /**
     * Determines if we should add a class that enables or prevents scrolling.
     *
     * @param {object} inst
     * @returns {string}
     * @private
     */
    _determineScroll = (inst) => {
        const {
            loading,
            overlay
        } = inst.props;

        if ((loading && loading.get('show')) || (overlay && overlay.get('show'))) {
            return 'no-scroll';
        }
        else {
            return 'scroll';
        }
    };

    /**
     * Given current state information, determine what view to display
     *
     * @param {object} inst - Reference to React Component
     * @returns {*} - React Component View
     * @private
     */
    _determineView = (inst) => {
        const {
            nav
        } = inst.props;

        let currentMainView = nav.get('mainView');
        let currentEventView = nav.get('eventView');
        let currentSubView = getCurrentSubView(nav);

        // Forgot password is handle a bit differently
        if (currentSubView && !is(currentSubView, VIEWS.subViews.FORGOT_PASSWORD_VIEW)) {

            if (currentSubView.get('id') === VIEWS.subViews.CALENDAR_EVENTS_VIEW.get('id')) {
                return <CalendarEventsView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.EMAIL_COWORKERS_VIEW.get('id'))) {
                return <EmailCoworkersView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.NOTE_VIEW.get('id'))) {
                return <AddNoteView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.STAGE_TIME_VIEW.get('id'))) {
                return <StageTimeView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.CONTACT_VIEW.get('id'))) {
                return <ContactView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.SERVICE_VIEW.get('id'))) {
                return <ServiceView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.PRODUCT_VIEW.get('id'))) {
                return <ProductView/>;
            }

            if (is(currentSubView.get('id'), VIEWS.subViews.TODO_VIEW.get('id'))) {
                return <TodoView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.JOB_DETAIL_VIEW.get('id')))) {
                return <JobDetailView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.LEAD_OFFER_DETAIL_VIEW.get('id')))) {
                return <LeadOfferDetailView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.PAYOUT_DETAIL_VIEW.get('id')))) {
                return <PayoutDetailView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.JOB_MESSAGES_VIEW.get('id')))) {
                return <JobMessagesView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.JOB_APPLY_VIEW.get('id')))) {
                return <JobApplyView/>;
            }

            if( (is(currentSubView.get('id'), VIEWS.jobSubViews.JOB_APPLY_CONFIRMATION_VIEW.get('id')))) {
                return <JobApplyConfirmationView/>;
            }
        }
        else if (currentEventView) {
            if (is(currentEventView.get('id'), VIEWS.eventViews.TODO_LIST_VIEW.get('id'))) {
                return <TodoListView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.CONTACTS_VIEW.get('id'))) {
                return <ContactsView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.CUSTOM_VIEW.get('id'))) {
                return <CustomView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.DETAILS_VIEW.get('id'))) {
                return <DetailsView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.JOB_VIEW.get('id'))) {
                return <JobEventView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.LIBRARY_VIEW.get('id'))) {
                return <LibraryView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.MISC_VIEW.get('id'))) {
                return <MiscView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.SERVICES_VIEW.get('id'))) {
                return <ServicesView/>;
            }

            if (is(currentEventView.get('id'), VIEWS.eventViews.TRAVEL_VIEW.get('id'))) {
                return <TravelView/>;
            }
        }
        else if (currentMainView) {

            if (is(currentMainView.get('id'), VIEWS.mainViews.CALENDAR_VIEW.get('id'))) {
                return <CalendarView/>;
            }

            if (is(currentMainView.get('id'), VIEWS.mainViews.DASHBOARD_VIEW.get('id'))) {
                return <DashboardView/>;
            }

            if (is(currentMainView.get('id'), VIEWS.mainViews.NEW_EVENT_VIEW.get('id'))) {
                return <NewEventView/>;
            }

            if (is(currentMainView.get('id'), VIEWS.mainViews.SEARCH_VIEW.get('id'))) {
                return <SearchView/>;
            }

            if (is(currentMainView.get('id'), VIEWS.mainViews.SETTINGS_VIEW.get('id'))) {
                return <SettingsView/>;
            }

            // Job Board Views
            if (is(currentMainView.id, VIEWS.jobViews.CONFIRMED_EVENTS_VIEW.id)) {
                return <ConfirmedEventsView/>;
            }

            if (is(currentMainView.id, VIEWS.jobViews.JOB_BOARD_VIEW.id)) {
                return <JobBoardView/>;
            }

            // if (is(currentMainView.id, VIEWS.jobViews.LEADS_OFFERS_VIEW.id)) {
            //     return <LeadsOffersView/>;
            // }
        }

        return null;
    };

    /**
     * Gets the view cycle information for next and previous functionality
     *
     * @param {object} inst - Reference to React Component
     * @returns {{viewCycle: *[], currentView: *}}
     * @private
     */
    _getCurrentViewData = (inst) => {
        const {
            nav
        } = inst.props;
        let currentMainView = nav.get('mainView');
        let currentEventView = nav.get('eventView');

        let viewCycle = mainViewCycle;
        let currentView = currentMainView;

        if (currentEventView) {
            viewCycle = eventViewCycle;
            currentView = currentEventView;
        }

        return {
            viewCycle: viewCycle,
            currentView: currentView
        };
    };

    /**
     * Determines if the swipe navigation should be enabled
     *
     * @param {object} inst - Reference to React Component
     * @returns {boolean}
     * @private
     */
    _isSwipeNavEnabled = (inst) => {
        // Until we get a few workable use cases, this remains disabled
        return false;

        const {
            nav
        } = inst.props;

        const eventView = nav.get('eventView');
        const subView = getCurrentSubView(nav);

        return (!_shelfOpened && _swipeEnabled && eventView && !subView);
    };

    /**
     * Updates the state to change to the next view in the cycle
     *
     * @param {object} inst - Reference to React Component
     * @private
     */
    _nextView = (inst) => {
        const {
            dispatch,
            nav
        } = inst.props;
        const currentEventView = nav.get('eventView');

        const nextView = _determineNextView(inst);

        if (currentEventView) {
            dispatch(changeEventView(nextView));
        }
        else {
            dispatch(changeMainView(nextView));
        }
    };

    /**
     * Updates the state to change to the previous view in the cycle
     *
     * @param {object} inst - Reference to the React Component
     * @private
     */
    _prevView = (inst) => {
        const {
            dispatch,
            nav
        } = inst.props;
        const currentEventView = nav.get('eventView');

        const prevView = _determinePrevView(inst);

        if (currentEventView) {
            dispatch(changeEventView(prevView));
        }
        else {
            dispatch(changeMainView(prevView));
        }
    };

    /**
     * Updates the state with the current status of the shelf (open/closed)
     * @param {boolean} isOpen
     * @private
     */
    _shelfChangeHandler = (isOpen) => {
        _shelfOpened = isOpen;
    };

    /**
     * Determines if we should render the Messages block
     *
     * @param {object} inst
     * @returns {*|boolean}
     * @private
     */
    _shouldShowMessages = (inst) => {
        const {
            nav,
            messages
        } = inst.props;

        return (messages && messages.size && nav.get('mainView') !== VIEWS.mainViews.SEARCH_VIEW);
    };

    /**
     * Handles swipe interactions to change views
     * @param {event} e
     * @param {object} inst
     * @private
     */
    _swipeHandler = (e, inst) => {
        e.preventDefault();

        if (!_isSwipeNavEnabled(inst)) return;

        // if (e.deltaX > 0) {
        //     _prevView(inst);
        // }
        // else {
        //     _nextView(inst);
        // }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            loading: PropTypes.object.isRequired,
            messages: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            overlay: PropTypes.object.isRequired
        },
        propsPriority: [
            'nav',
            'overlay',
            'loading',
            'messages'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messages
         */
        displayName: 'NavWrapperView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioMixin],
        /**
         * Sets up the Radio channels we are listening on
         *
         * @returns {object}
         */
        Radio_setup() {
            let radios = {};

            radios[RADIOS.ui.TOGGLE_SWIPE_NAV] = (enabled) => {
                _swipeEnabled = enabled;
            };

            return radios;
        },

        /**
         * Invoked immediately after the component's updates are
         * flushed to the DOM.
         *
         * @param prevProps
         * @param prevState
         */
        componentDidUpdate(prevProps, prevState) {
            const prevNav = prevProps.nav;
            const {
                dispatch,
                nav,
                messages
            } = this.props;

            const currentSubView = getCurrentSubView(nav);

            // If we get a message in, then scroll to the top to see it
            // Don't scroll to top for the message view
            if (!is(nav, prevNav) && (currentSubView && currentSubView.id !== VIEWS.jobSubViews.JOB_MESSAGES_VIEW.id)) {
                document.body.scrollTop = 0;
                this.refs.content.scrollTop = 0;

                dispatch(clearSubmitForm());
            }
        },

        /**
         * Builds the virtual DOM/HTml
         *
         * @returns {*|XML|JSX}
         */
        render() {
            const {
                nav
            } = this.props;

            const view = _determineView(this);

            return <LayoutManager shelfChangeHandler={_shelfChangeHandler}>
                <div id="content" ref='content' className={`content ${_determineScroll(this)}`}>
                    {(_shouldShowMessages(this) ? <MessageSnacks/> : null)}
                    <DialogGroup/>
                    <div>{view}</div>
                </div>

            </LayoutManager>;
        }
        // ,
        // componentWillUnmount() {
        //     _swipeEnabled = true;
        //     _shelfOpened = false;
        // }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { NavigatorFactory }