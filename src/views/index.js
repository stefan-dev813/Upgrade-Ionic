// event views
import { ContactsViewFactory } from './eventViews/ContactsView';
import { CustomViewFactory } from './eventViews/CustomView';
import { DetailsViewFactory } from './eventViews/DetailsView';
import { JobEventViewFactory } from './eventViews/JobEventView';
import { LibraryViewFactory } from './eventViews/LibraryView';
import { MiscViewFactory } from './eventViews/MiscView';
import { ServicesViewFactory } from './eventViews/ServicesView';
import { TodoListViewFactory } from './eventViews/TodoListView';
import { TravelViewFactory } from './eventViews/TravelView';

// main views
import { DashboardViewFactory } from './DashboardView';
import { CalendarViewFactory } from './CalendarView';
import { LoginViewFactory } from './LoginView';
import { NewEventViewFactory } from './NewEventView';
import { SearchViewFactory } from './SearchView';
import { SettingsViewFactory } from './SettingsView';

// job views
import { ConfirmedEventsViewFactory } from './jobViews/ConfirmedEventsView';
import { JobApplyViewFactory } from './jobViews/JobApplyView';
import { JobApplyConfirmationViewFactory } from './jobViews/JobApplyConfirmationView';
import { JobBoardViewFactory } from './jobViews/JobBoardView';
import { JobDetailViewFactory } from './jobViews/JobDetailView';
import { JobMessagesViewFactory } from './jobViews/JobMessagesView';
import { LeadOfferDetailViewFactory } from './jobViews/LeadOfferDetailView';
import { LeadsOffersViewFactory } from './jobViews/LeadsOffersView';
import { PayoutDetailViewFactory } from './jobViews/PayoutDetailView';

const eventViews = {
    ContactsViewFactory,
    CustomViewFactory,
    DetailsViewFactory,
    JobEventViewFactory,
    LibraryViewFactory,
    MiscViewFactory,
    ServicesViewFactory,
    TodoListViewFactory,
    TravelViewFactory
};

const mainViews = {
    DashboardViewFactory,
    CalendarViewFactory,
    LoginViewFactory,
    NewEventViewFactory,
    SearchViewFactory,
    SettingsViewFactory
};

const jobViews = {
    ConfirmedEventsViewFactory,
    JobApplyViewFactory,
    JobApplyConfirmationViewFactory,
    JobBoardViewFactory,
    JobDetailViewFactory,
    JobMessagesViewFactory,
    LeadOfferDetailViewFactory,
    LeadsOffersViewFactory,
    PayoutDetailViewFactory
};

export {
    mainViews,
    eventViews,
    jobViews,
    DashboardViewFactory,
    CalendarViewFactory,
    LoginViewFactory,
    NewEventViewFactory,
    SearchViewFactory,
    SettingsViewFactory
}