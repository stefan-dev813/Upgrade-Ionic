/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
import NavItemModel from '../stores/models/NavItemModel';
import _ from 'lodash';
import {TranslateActionsFactory} from '../actions';
import Platform from '../util/Platform';

const {getText} = TranslateActionsFactory({});

/**************************************************************************
 *
 * Private Members
 *
 *************************************************************************/

const mainViews = {
    CALENDAR_VIEW: NavItemModel({
        id: 'VIEWS_CALENDAR_VIEW',
        label: getText('Calendar'),
        iconClass: 'today',
        order: 1
    }),
    DASHBOARD_VIEW: NavItemModel({
        id: 'VIEWS_DASHBOARD_VIEW',
        label: getText('Dashboard'),
        iconClass: 'dashboard',
        order: 2
    }),
    LOGIN_VIEW: NavItemModel({
        id: 'VIEWS_LOGIN_VIEW',
        label: getText('Login')
    }),
    NEW_EVENT_VIEW: NavItemModel({
        id: 'VIEWS_NEW_EVENT_VIEW',
        label: getText('New Event'),
        iconClass: 'add',
        order: 4
    }),
    SEARCH_VIEW: NavItemModel({
        id: 'VIEWS_SEARCH_VIEW',
        label: getText('Search'),
        iconClass: 'search',
        order: 3
    }),
    SETTINGS_VIEW: NavItemModel({
        id: 'VIEWS_SETTINGS_VIEW',
        label: getText('Settings'),
        iconClass: 'settings',
        order: 6
    }),
    JOBS_VIEW: NavItemModel({
        id: 'VIEWS_JOBS_VIEW',
        label: getText('Job Board'),
        iconClass: 'local-offer',
        order: 4
    })
};

const eventViews = {
    CONTACTS_VIEW: NavItemModel({
        id: 'VIEWS_CONTACTS_VIEW',
        label: getText('Contacts'),
        iconClass: 'contacts',
        order: 3
    }),
    CUSTOM_VIEW: NavItemModel({
        id: 'VIEWS_CUSTOM_VIEW',
        label: getText('Custom'),
        iconClass: 'text-fields',
        order: 9
    }),
    DETAILS_VIEW: NavItemModel({
        id: 'VIEWS_DETAILS_VIEW',
        label: getText('Details'),
        iconClass: 'details',
        order: 2
    }),
    LIBRARY_VIEW: NavItemModel({
        id: 'VIEWS_LIBRARY_VIEW',
        label: getText('Library'),
        iconClass: 'library-books',
        order: 7
    }),
    MISC_VIEW: NavItemModel({
        id: 'VIEWS_MISC_VIEW',
        label: getText('Misc'),
        iconClass: 'folder',
        order: 8
    }),
    SERVICES_VIEW: NavItemModel({
        id: 'VIEWS_SERVICES_VIEW',
        label: getText('Services'),
        iconClass: 'attach-money',
        order: 5
    }),
    TODO_LIST_VIEW: NavItemModel({
        id: 'TODO_LIST_VIEW',
        label: getText('Action List'),
        iconClass: 'playlist-add-check',
        order: 6
    }),
    TRAVEL_VIEW: NavItemModel({
        id: 'VIEWS_TRAVEL_VIEW',
        label: getText('Travel'),
        iconClass: 'card-travel',
        order: 4
    }),
    JOB_VIEW: NavItemModel({
        id: 'VIEWS_JOB_VIEW',
        label: getText('Job'),
        iconClass: 'work',
        order: 1
    })
};

const subViews = {
    CALENDAR_EVENTS_VIEW: NavItemModel({id: 'CALENDAR_EVENTS_VIEW', label: getText('Daily Events')}),
    CONTACT_VIEW: NavItemModel({id: 'CONTACT_VIEW', label: getText('Contact')}),
    NOTE_VIEW: NavItemModel({id: 'NOTE_VIEW', label: getText('Note')}),
    EMAIL_COWORKERS_VIEW: NavItemModel({id: 'EMAIL_COWORKERS_VIEW', label: getText('Email to Co-workers')}),
    FORGOT_PASSWORD_VIEW: NavItemModel({id: 'FORGOT_PASSWORD_VIEW', label: getText('Forgot Password')}),
    PRODUCT_VIEW: NavItemModel({id: 'PRODUCT_VIEW', label: getText('Product')}),
    SERVICE_VIEW: NavItemModel({id: 'SERVICE_VIEW', label: getText('Service')}),
    STAGE_TIME_VIEW: NavItemModel({id: 'STAGE_TIME_VIEW', label: getText('Stage Time')}),
    TODO_VIEW: NavItemModel({id: 'TODO_VIEW', label: getText('Action')})
};

const jobViews = {
    JOB_BOARD_VIEW: NavItemModel({id: 'JOB_BOARD_VIEW', label: getText('Job Board')}),
    // LEADS_OFFERS_VIEW: NavItemModel({id: 'LEADS_OFFERS_VIEW', label: getText('Leads & Offers')}),
    CONFIRMED_EVENTS_VIEW: NavItemModel({id: 'CONFIRMED_EVENTS_VIEW', label: getText('Confirmed Events')})
};

const jobSubViews = {
    JOB_APPLY_CONFIRMATION_VIEW: NavItemModel({id: 'JOB_APPLY_CONFIRMATION_VIEW', label: getText('Sent to Buyer')}),
    JOB_APPLY_VIEW: NavItemModel({id: 'JOB_APPLY_VIEW', label: getText('Apply to Job')}),
    JOB_MESSAGES_VIEW: NavItemModel({id: 'JOB_MESSAGES_VIEW', label: getText('Messages'), iconClass: 'message'}),
    JOB_DETAIL_VIEW: NavItemModel({id: 'JOB_DETAIL_VIEW', label: getText('Job Details')}),
    LEAD_OFFER_DETAIL_VIEW: NavItemModel({id: 'LEAD_OFFER_DETAIL_VIEW', label: getText('Lead/Offer Details')}),
    PAYOUT_DETAIL_VIEW: NavItemModel({id: 'PAYOUT_DETAIL_VIEW', label: getText('Payout Details')})
};

/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/

export default {
    mainViews,
    eventViews,
    subViews,
    jobSubViews,
    jobViews,
    getFooterNavItems(includeSearch = true) {
        let views = Platform.isSolutionTree() ? _.omit(mainViews, ['JOBS_VIEW']) : mainViews;
        return _.sortBy(_.filter(views, (navItem) => {
            return (navItem.id !== mainViews.LOGIN_VIEW.id) && (includeSearch || (!includeSearch && navItem !== mainViews.SEARCH_VIEW)) && navItem.has('order');
        }), (v) => {
            return v.order;
        });
    },
    getSolutionTreeEventViews() {
        return {
            CONTACTS_VIEW: eventViews.CONTACTS_VIEW,
            DETAILS_VIEW: eventViews.DETAILS_VIEW,
            MISC_VIEW: eventViews.MISC_VIEW.set('order', 3)
        };
    },
    getEspeakersMainViews() {
        return mainViews;
    },
    getSolutionTreeMainViews() {
        return _.omit(mainViews, ['JOBS_VIEW']);
    },
    getJobBoardViews() {
        return jobViews;
    }
};