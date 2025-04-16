/**
 * Creates a StoreWrapperView component.  Manages the root state.
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes RadioMixin
 */
const StoreWrapperViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const {
        createClass
    } = React;
    const _ = require('lodash');
    const {
        is
    } = require('immutable');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Radio
    const {
        RadioMixin
    } = require('react-pubsub-via-radio.js');

    // Stores
    const {
        AuthStoreFactory,
        CalendarStoreFactory,
        DashboardStoreFactory,
        DialogStoreFactory,
        DisplayDataStoreFactory,
        EventStoreFactory,
        LoadingStoreFactory,
        MessageStoreFactory,
        NavStoreFactory,
        OverlayStoreFactory,
        PushStoreFactory,
        SearchStoreFactory,
        SpeakerInfoStoreFactory,
        ViewStoreFactory
    } = require('../stores');

    // Views
    const MainViewFactory = require('./MainView');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    let _stores = [];
    let _pendingStateQueue = [];
    let _processingState = false;
    let _multiUpdateEnabled = false;
    let _multiUpdateState = null;

    // Stores
    const AuthStore = AuthStoreFactory({});
    const CalendarStore = CalendarStoreFactory({});
    const DashboardStore = DashboardStoreFactory({});
    const DialogStore = DialogStoreFactory({});
    const DisplayDataStore = DisplayDataStoreFactory({});
    const EventStore = EventStoreFactory({});
    const LoadingStore = LoadingStoreFactory({});
    const MessageStore = MessageStoreFactory({});
    const NavStore = NavStoreFactory({});
    const OverlayStore = OverlayStoreFactory({});
    const PushStore = PushStoreFactory({});
    const SearchStore = SearchStoreFactory({});
    const SpeakerInfoStore = SpeakerInfoStoreFactory({});
    const ViewStore = ViewStoreFactory({});

    /**********************************
     * Methods
     *********************************/

    let _processStateChange;
    let _reduceStateChange;

    /**
     *
     * @param inst
     * @private
     */
    _processStateChange = (inst) => {
        if (_pendingStateQueue.length) {
            let {
                radio,
                payload
            } = _pendingStateQueue.shift();

            _processingState = true;

            inst.setState(_reduceStateChange(radio, payload, inst.state), () => {
                if (_pendingStateQueue.length) {
                    _processStateChange(inst);
                }

                _processingState = false;
            });
        }
    };

    /**
     *
     * @param {string} radio
     * @param {*} payload
     * @param {object} state
     * @returns {{auth: *, calendar: *, dashboard: *, dialog: *, displayData: *, event: *, loading: *, messages: *, nav: *, overlay: *, search: *, speakerInfo: *, view: *}}
     * @private
     */
    _reduceStateChange = (radio, payload, state) => {
        // For debugging purposes
        let newState = {
            auth: AuthStore.handleRadio(radio, payload, state.auth),
            calendar: CalendarStore.handleRadio(radio, payload, state.calendar),
            dashboard: DashboardStore.handleRadio(radio, payload, state.dashboard),
            dialog: DialogStore.handleRadio(radio, payload, state.dialog),
            displayData: DisplayDataStore.handleRadio(radio, payload, state.displayData),
            event: EventStore.handleRadio(radio, payload, state.event),
            loading: LoadingStore.handleRadio(radio, payload, state.loading),
            messages: MessageStore.handleRadio(radio, payload, state.messages),
            nav: NavStore.handleRadio(radio, payload, state.nav),
            overlay: OverlayStore.handleRadio(radio, payload, state.overlay),
            push: PushStore.handleRadio(radio, payload, state.push),
            search: SearchStore.handleRadio(radio, payload, state.search),
            speakerInfo: SpeakerInfoStore.handleRadio(radio, payload, state.speakerInfo, state.auth, state.displayData),
            view: ViewStore.handleRadio(radio, payload, state.view)
        };

        return newState;
    };


    /**********************************
     * Factories
     *********************************/

    // Views
    const MainView = MainViewFactory({});

    // Build stores collection
    _stores = [AuthStore,
        CalendarStore,
        DashboardStore,
        DialogStore,
        DisplayDataStore,
        EventStore,
        LoadingStore,
        MessageStore,
        NavStore,
        OverlayStore,
        PushStore,
        SearchStore,
        SpeakerInfoStore,
        ViewStore
    ];

    /**************************************************************************
     *
     * Public Interface / React
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messages
         */
        displayName: 'StoreWrapperView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [RadioMixin],
        /**
         * Invoked once before the component is mounted. The return value will
         * be used as the initial value of this.state.
         *
         * Iterates over all state stores to determine the app wide initial state
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                auth: AuthStore.getInitialState(),
                calendar: CalendarStore.getInitialState(),
                dashboard: DashboardStore.getInitialState(),
                dialog: DialogStore.getInitialState(),
                displayData: DisplayDataStore.getInitialState(),
                event: EventStore.getInitialState(),
                loading: LoadingStore.getInitialState(),
                messages: MessageStore.getInitialState(),
                nav: NavStore.getInitialState(),
                overlay: OverlayStore.getInitialState(),
                push: PushStore.getInitialState(),
                search: SearchStore.getInitialState(),
                speakerInfo: SpeakerInfoStore.getInitialState(),
                view: ViewStore.getInitialState()
            };
        },
        /**
         * Sets up the radio channels we are listening on.  Creates a shared listener
         * for all Store RADIOs that passes the information to all available stores
         * who will then determine what updates to do, if any.
         */
        Radio_setup: function() {
            let channels = {};

            _.map(RADIOS.stores, (radio) => {
                channels[radio] = (payload) => {
                    if (radio === RADIOS.stores.MULTI_UPDATE_START) {
                        if (!_multiUpdateEnabled) {
                            _multiUpdateEnabled = true;
                            _multiUpdateState = _.assign({}, this.state);
                        }
                    }
                    else if (radio === RADIOS.stores.MULTI_UPDATE_STOP) {
                        // flush the multi-update to the state
                        _multiUpdateEnabled = false;

                        if (_multiUpdateState) {
                            // TODO: this isn't very DRY and can be optimized
                            _processingState = true;
                            this.setState(_multiUpdateState, () => {
                                if (_pendingStateQueue.length) {
                                    _processStateChange(this);
                                }

                                _processingState = false;
                                _multiUpdateState = null;
                            });
                        }
                        else if (_pendingStateQueue.length) {
                            _processStateChange(this);
                        }

                    }
                    else if (_multiUpdateEnabled) {
                        // instead of the normal queue we want to just keep talling up the state changes and then flushing
                        // them at the end

                        _multiUpdateState = _reduceStateChange(radio, payload, _multiUpdateState);
                    }
                    else {
                        _pendingStateQueue.push({
                            radio: radio,
                            payload: payload
                        });

                        if (!_processingState) {
                            _processStateChange(this);
                        }
                        else {
                            log(`Already processing.  Try a multi-update. (${radio})`);
                        }
                    }
                };
            });

            return channels;
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            // Pass in the entire state as props and let the children determine
            // if/when they should use and update any items off of it.
            return <MainView {..._.assign({ref: 'mainView'}, this.state)} />;
        }
    });
}

export { StoreWrapperViewFactory }