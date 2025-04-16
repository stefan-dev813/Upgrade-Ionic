/**
 * Generates a SearchList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SearchListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const {fromJS} = require('immutable');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Components
    const {SearchResultCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Actions
    const {
        CalendarActionsFactory
    } = require('../../actions');

    const esUtils = require('ES/utils/esUtils');
    const DateToolsFactory = require('../../util/DateTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        extractMonthData
    } = CalendarActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Components
     *********************************/

    const SearchResultCard = SearchResultCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generateListDataSortedResults;

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateListDataSortedResults = (inst) => {
        const {
            calendar,
            search
        } = inst.props;

        let data = [];
        let id = 0;

        const selectedYear = calendar.get('selectedYear');
        const selectedMonth = calendar.get('selectedMonth');
        const monthData = extractMonthData(calendar);

        let calData;
        let calDetails;
        let dayData;
        let details = [];

        if (monthData) {
            calData = monthData.data;
            calDetails = monthData.details;

            const dayCount = esUtils.get_n_days_in_month(selectedYear, selectedMonth);

            _.map(_.range(1, dayCount + 1), (day) => {
                dayData = _.has(calData, day) ? calData[day] : {};

                details = details.concat(_.uniqBy(_.reject(_.map(dayData.detail_ids, (detail_id) => {
                    return calDetails && calDetails[detail_id];
                }), _.isEmpty), (detail) => {
                    if (detail.eid && detail.eid > 0) {

                      return [detail.eid, detail.type].join("$");
                    }
                    return [detail.desc, detail.type].join("$");
                }));
            });
        }

        const noResults = search.get('noResults');
        const searchTerm = search.get('searchTerm');

        let results = search.get('results');
        let lastDate = null;
        let sortedResults;

        if ((!results || !results.size) &&
            (!searchTerm || !searchTerm.length) &&
            (!noResults)) {

            results = fromJS(details);
        }

        sortedResults = results.sort((resultA, resultB) => {
            let stampA = resultA.get('str');
            let stampB = resultB.get('str');

            if (stampA && !_.isNumber(stampA)) {
                stampA = DateTools.convertToBalboaTrunkTimestamp(esUtils.convertFromISO8601(stampA));
            }

            if (stampB && !_.isNumber(stampB)) {
                stampB = DateTools.convertToBalboaTrunkTimestamp(esUtils.convertFromISO8601(stampB));
            }

            if (stampA < 0 && stampB > 0) {
                return -1;
            }
            else if (stampB < 0 && stampA > 0) {
                return 1;
            }
            else if (stampA < stampB) {
                return 1;
            }
            else if (stampB < stampA) {
                return -1;
            }

            return 0;
        });

        if (sortedResults && sortedResults.size) {
            sortedResults.map((item) => {
                let date = null;
                let formattedDate;
                let formattedLastDate;
                let dateChanged = false;

                if (_.isEmpty(item.get('eid'))) {
                    return item;
                }

                let stamp = item.get('str');

                if (stamp && !_.isNumber(stamp)) {
                    stamp = DateTools.convertToBalboaTrunkTimestamp(esUtils.convertFromISO8601(stamp));
                }

                if (stamp > 0) {
                    date = DateTools.convertFromBalboaTrunkTimestamp(stamp);
                }

                if (date) {
                    if (!lastDate) {
                        lastDate = date;
                        dateChanged = true;
                    }

                    formattedLastDate = esUtils.format_date(lastDate, esUtils.format_date.masks.mediumDate);
                    formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);

                    if (formattedDate !== formattedLastDate) {
                        lastDate = date;
                        dateChanged = true;
                    }
                }

                if (dateChanged) {
                    data.push({
                        id: id += 1,
                        header: true,
                        title: formattedDate
                    });
                }

                data.push({
                    id: id += 1,
                    card: SearchResultCard,
                    props: {
                        formattedDate: (date ? formattedDate : null),
                        status: item.get('sta') || item.get('type') || '',
                        organization: item.get('desc'),
                        deliveryMethod: item.get('dm'),
                        city: item.get('vcty'),
                        state: item.get('vst'),
                        country: item.get('vcnt'),
                        dataEid: item.get('eid')
                    }
                });
            });
        }

        return data;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired,
            search: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'SearchList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const sortedResults = _generateListDataSortedResults(this);

            return (
                <List>
                    {sortedResults ? _.map(sortedResults, (result) => {
                        let key = `search-result-${result.id}`;

                        if (result.header) {
                            return <SectionHeader key={key}>{result.title}</SectionHeader>;
                        }

                        return <div key={key}>
                            <SearchResultCard {...result.props}/>

                            <Divider/>
                        </div>;
                    }) : null}
                </List>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SearchListFactory }