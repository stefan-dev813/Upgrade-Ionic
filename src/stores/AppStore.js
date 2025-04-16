/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/

// NPM
const {combineReducers} = require('redux');
const {responsiveStateReducer} = require('redux-responsive');

import {AuthStoreFactory} from "./AuthStore";
import {CalendarStoreFactory} from "./CalendarStore";
import {CompanyDataStoreFactory} from "./CompanyDataStore";
import {DashboardStoreFactory} from "./DashboardStore";
import {DialogStoreFactory} from "./DialogStore";
import {DisplayDataStoreFactory} from "./DisplayDataStore";
import {EventStoreFactory} from "./EventStore";
import {JobBoardStoreFactory} from "./JobBoardStore";
import {LoadingStoreFactory} from "./LoadingStore";
import {MessageStoreFactory} from "./MessageStore";
import {NavStoreFactory} from "./NavStore";
import {OverlayStoreFactory} from "./OverlayStore";
import {PushStoreFactory} from "./PushStore";
import {SearchStoreFactory} from "./SearchStore";
import {SpeakerInfoStoreFactory} from "./SpeakerInfoStore";
import {ViewStoreFactory} from "./ViewStore";
// Reducers
// const {
//     // AuthStoreFactory,
//     // CalendarStoreFactory,
//     // CompanyDataStoreFactory,
//     // DashboardStoreFactory,
//     DialogStoreFactory,
//     DisplayDataStoreFactory,
//     EventStoreFactory,
//     JobBoardStoreFactory,
//     LoadingStoreFactory,
//     MessageStoreFactory,
//     NavStoreFactory,
//     OverlayStoreFactory,
//     PushStoreFactory,
//     SearchStoreFactory,
//     SpeakerInfoStoreFactory,
//     ViewStoreFactory
// } = require('./');

/******************************************************************************
 *
 * Private Members
 *
 *****************************************************************************/

/**************************************
 * Components
 *************************************/

const auth = AuthStoreFactory();
const browser = responsiveStateReducer;
const calendar = CalendarStoreFactory();
const companyData = CompanyDataStoreFactory();
const dashboard = DashboardStoreFactory();
const dialog = DialogStoreFactory();
const displayData = DisplayDataStoreFactory();
const event = EventStoreFactory();
const jobBoard = JobBoardStoreFactory();
const loading = LoadingStoreFactory();
const messages = MessageStoreFactory();
const nav = NavStoreFactory();
const overlay = OverlayStoreFactory();
const push = PushStoreFactory();
const search = SearchStoreFactory();
const speakerInfo = SpeakerInfoStoreFactory();
const view = ViewStoreFactory();

/******************************************************************************
 *
 * Exports/Public Interface
 *
 *****************************************************************************/

export default combineReducers({
    auth,
    browser,
    calendar,
    companyData,
    dashboard,
    dialog,
    displayData,
    event,
    jobBoard,
    loading,
    messages,
    nav,
    overlay,
    push,
    search,
    speakerInfo,
    view
});