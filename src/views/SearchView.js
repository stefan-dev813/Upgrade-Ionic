/**
 * Generates the SearchView component
 *
 * @param {object} spec - Container for named parameters
 * @property {boolean} spec.noHeader - If the view is being loaded with no header
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SearchViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

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

    // Factories
    const {SearchFormFactory} = require('../forms/SearchForm');
    const {MessageListFactory, SearchListFactory} = require('../components/list');

    // Radios
    const {
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');
    const RADIOS = require('../enums/RADIOS').default;
    const EVENT_STATUSES = require('../enums/EVENT_STATUSES').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../mixins');

    // Utilities
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        LoadingActionsFactory,
        MessageActionsFactory,
        SearchActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const {
        noHeader
    } = spec;

    /**********************************
     * Actions
     *********************************/

    const {
        hideLoading,
        showLoading
    } = LoadingActionsFactory({});
    const {
        addMessage,
        clearMessages
    } = MessageActionsFactory({});
    const {
        updateSearchStore,
        clearSearch,
        searchEvents
    } = SearchActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const MessageList = MessageListFactory({});
    const SearchForm = SearchFormFactory({});
    const SearchList = SearchListFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     * Handles Search Form submission
     *
     * @param {object} form - Form values
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            speakerInfo
        } = inst.props;

        if (speakerInfo.get('selectedSpeaker')) {
            // reset the state and clear the view then run the search again
            dispatch(clearSearch());

            dispatch(clearMessages());

            dispatch(updateSearchStore({
                searchTerm: form.search
            }));

            let excludeEventTypes = [EVENT_STATUSES.EVENT_STATUSES.zimbra, EVENT_STATUSES.EVENT_STATUSES.closed];

            if (!form.includeCanceled) {
                excludeEventTypes.push(EVENT_STATUSES.EVENT_STATUSES.canceled);
            }

            searchEvents(_.assign({}, form, {
                sid: speakerInfo.get('selectedSpeaker').get('sid'),
                excludeEventTypes: excludeEventTypes
            }));
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            search: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        },
        propsPriority: [
            'search',
            'speakerInfo'
        ]
    });

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interfaces
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'SearchView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin, ViewMixin],
        /**
         * Sets up the Service radio channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.services.SEARCH_EVENTS] = {
                key() {
                    const {
                        speakerInfo
                    } = this.props;

                    return speakerInfo.get('selectedSpeaker').get('sid').toString();
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        data.autoSearch = false;

                        let hasResults = (data && data.results && data.results.length > 0);
                        data.noResults = !hasResults;

                        dispatch(updateSearchStore(data));

                        if (!data || !data.results || !data.results.length) {
                            dispatch(addMessage({
                                text: getText('No Events Found'),
                                type: 'info'
                            }));
                        }

                        if (data.description && data.description.length) {
                            dispatch(addMessage({
                                text: data.description,
                                type: 'info'
                            }));
                        }
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(addMessage({
                            text: error,
                            type: 'error'
                        }));
                    }
                }
            };

            return radios;
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                isTablet
            } = this.props;

            return <div style={{
                height: '100%'
            }}>
                <div style={{
                    position: 'fixed',
                    width: (isTablet ? '256px' : '100%'),
                    zIndex: 10
                }}>
                    <SearchForm
                        ref='searchForm'
                        isTablet={isTablet}
                        onSubmit={(e) => {
                            _submitHandler(e, this);
                        }}/>
                </div>

                <div style={{
                    position: 'relative',
                    paddingTop: (isTablet ? '150px' : '145px'),
                    bottom: '56px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    width: '100%'
                }}>
                    <MessageList/>
                    <SearchList/>
                </div>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SearchViewFactory }