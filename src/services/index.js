const AuthenticateService = require('./AuthenticateService').default;
const CalendarService = require('./CalendarService').default;
const EventService = require('./EventService').default;
const JobBoardService = require('./JobBoardService').default;
const SearchService = require('./SearchService').default;
const LocalStorageServiceFactory = require('./LocalStorageService').default;
const LoginServiceFactory = require('./LoginService');

AuthenticateService.init();
CalendarService.init();
EventService.init();
JobBoardService.init();
SearchService.init();

export {
    AuthenticateService,
    CalendarService,
    EventService,
    JobBoardService,
    LocalStorageServiceFactory,
    LoginServiceFactory,
    SearchService
};