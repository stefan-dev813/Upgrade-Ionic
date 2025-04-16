/**
 * Generates a SearchForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const SearchFormFactory = (spec) => {
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
    const v = require('react-loose-forms.validation');
    const {
        connect
    } = require('react-redux');
    const {is} = require('immutable');
    const moment = require('moment');

    // Factories
    const {
        LinkCollapseAreaFactory
    } = require('../components');

    const IconButton = require('material-ui/IconButton').default;
    const IconMap = require('../theme/IconMap');

    const Paper = require('material-ui/Paper').default;

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');

    // Actions
    const {
        EventActionsFactory,
        SearchActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    // Utils
    const Platform = require('../util/Platform').default;

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
        updateSearchStore
    } = SearchActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const LinkCollapseArea = LinkCollapseAreaFactory({});

    /**********************************
     * Methods
     *********************************/

    let _autoSearch;
    let _buildAdvancedSearchFormSchema;
    let _buildSearchFormSchema;
    let _clearSearchFocus;
    let _hasExistingSearch;
    let _searchClickHandler;
    let _toggleAutoFocus;

    /**
     * Triggers an automatic search if a searchTerm is provided
     *
     * @param {object} inst - Reference to React Component
     * @private
     */
    _autoSearch = (inst) => {
        inst.Form_onSubmit(null);
    };

    /**
     * Builds form input instructions for the Search section
     *
     * @returns {object}
     * @private
     */
    _buildSearchFormSchema = (inst) => {
        const {
            search
        } = inst.props;
        const searchTerm = search.get('searchTerm');

        let focusObj = _.clone(inst.state);

        return {
            search: _.assign({
                name: 'search',
                type: 'text',
                placeholder: getText('Search'),
                validate: (search.autoSearch ? v.optional : v.required),
                icon: false
            }, focusObj)
        };
    };

    /**
     * Builds form input instructions for the Advanced Search section
     *
     * @returns {object}
     * @private
     */
    _buildAdvancedSearchFormSchema = (inst) => {
        const {
            isTablet
        } = inst.props;

        let schema = {
            deepSearch: {
                name: 'deepSearch',
                type: 'checkbox',
                label: getText('Deep Search'),
                noIcon: isTablet
            },
            includeCanceled: {
                name: 'includeCanceled',
                type: 'checkbox',
                label: getText('Include Canceled'),
                noIcon: isTablet
            },
            onlyDatelessEvents: {
                name: 'onlyDatelessEvents',
                type: 'checkbox',
                label: getText('Only Dateless Events'),
                noIcon: isTablet
            }
        };

        if (Platform.isEspeakers()) {
            schema = _.assign(schema, {
                marketplaceOnly: {
                    name: 'marketplaceOnly',
                    type: 'checkbox',
                    label: getText('Marketplace Only'),
                    noIcon: isTablet
                },
                futureOnly: {
                    name: 'futureOnly',
                    type: 'checkbox',
                    label: getText('Future Only'),
                    noIcon: isTablet
                }
            });
        }

        return schema;
    };

    /**
     *
     * @param inst
     * @private
     */
    _clearSearchFocus = (inst) => {
        _toggleAutoFocus(false, inst);
    };

    /**
     *
     * @param inst
     * @returns {boolean}
     * @private
     */
    _hasExistingSearch = (inst) => {
        const {
            search
        } = inst.props;

        const results = search.get('results');
        const noResults = search.get('noResults');

        if (noResults === true) {
            return true;
        }

        if (results && results.size > 0) {
            return true;
        }

        return false;
    };

    /**
     * Handles the Search button events.
     *
     * @param {event} event
     * @private
     */
    _searchClickHandler = (event, inst) => {
        _clearSearchFocus(inst);
        inst.Form_onSubmit(event);
        inst.refs.searchAdvancedOptions.hide();
    };

    /**
     *
     * @param isFocused
     * @private
     */
    _toggleAutoFocus = (isFocused, inst) => {
        inst.setState({
            autoFocus: isFocused,
            focusStamp: moment()
        });
    };

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            browser: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            search: PropTypes.object.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'SearchForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin],

        /**
         * Combines all the form input instructions
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, _buildSearchFormSchema(this),
                _buildAdvancedSearchFormSchema(this));
        },

        getInitialState() {
            return {
                autoFocus: undefined
            };
        },

        /**
         * Sets the initial values of a form
         *
         * @returns {object}
         */
        getInitialValues() {
            const {search} = this.props;

            return {
                search: search.searchTerm,
                deepSearch: search.deepSearch,
                includeCanceled: search.includeCanceled,
                onlyDatelessEvents: search.onlyDatelessEvents,
                marketplaceOnly: search.marketplaceOnly,
                futureOnly: search.futureOnly
            };
        },

        /**
         * Triggers when the component receives a new set of props
         *
         * @param {object} nextProps
         */
        componentWillReceiveProps(nextProps) {
            if(!is(this.props.search, nextProps.search)) {
                this.setState({
                    data: {
                        search: nextProps.search.searchTerm,
                        deepSearch: nextProps.search.deepSearch,
                        includeCanceled: nextProps.search.includeCanceled,
                        onlyDatelessEvents: nextProps.search.onlyDatelessEvents,
                        marketplaceOnly: nextProps.search.marketplaceOnly,
                        futureOnly: nextProps.search.futureOnly
                    }
                }, () => {
                    if(nextProps.search.autoSearch) {
                        _autoSearch(this);
                    }
                });
            }

            if (!is(nextProps.search, this.props.search) && nextProps.search && nextProps.search.get('results')) {
                _clearSearchFocus(this);
            }
        },
        /**
         * Invoked once immediately after the initial rendering occurs.
         */
        componentDidMount() {
            const {
                browser,
                search
            } = this.props;

            if (search.autoSearch && !_hasExistingSearch(this)) {
                _autoSearch(this);
            }

            if (_.isEmpty(search.searchTerm) && !search.autoSearch && Platform.isPhone(browser)) {
                _toggleAutoFocus(true, this);
            }
        },

        /**
         *
         * @param field
         * @param value
         */
        onFormChanged(field, value) {
            const {
                dispatch
            } = this.props;

            if(field !== 'search') {
                dispatch(updateSearchStore(_.pick(this.state.data, [
                    'deepSearch',
                    'includeCanceled',
                    'onlyDatelessEvents',
                    'marketplaceOnly',
                    'futureOnly',
                    'autoSearch'
                ])));
            }
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <form
                id='search-form'
                ref='search-form'
                onSubmit={this.Form_onSubmit}
                style={{
                    width: '100%'
                }}>
                <Paper rounded={false} style={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'nowrap'
                    }}>
                        <div style={{
                            order: 1,
                            flexGrow: 1
                        }}>
                            {this.generateFields({fields: _buildSearchFormSchema(this)})}
                        </div>
                        <div style={{
                            order: 1,
                            flexGrow: 0,
                            width: '56px',
                            paddingTop: '30px'
                        }}>
                            <IconButton
                                onClick={(e) => {
                                    stopProp(e);

                                    _searchClickHandler(e, this);
                                }}>

                                {IconMap.getElement('search')}
                            </IconButton>
                        </div>
                    </div>
                    <LinkCollapseArea ref='searchAdvancedOptions'>
                        {this.generateFields({fields: _buildAdvancedSearchFormSchema(this)})}
                    </LinkCollapseArea>
                </Paper>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SearchFormFactory }
