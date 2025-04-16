/**
 * Generates a CalendarEventList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const CalendarEventListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    const _ = require('lodash');
    const {fromJS} = require('immutable');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Components
    const {SearchResultCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../../components/SectionHeader');

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
            calendar
        } = inst.props;

        let data = [];
        let id = 0;


        // Process calendar data
        const monthData = extractMonthData(calendar);
        const selectedDay = calendar.get('selectedDay').toString();

        let calData;
        let calDetails;
        let dayData;
        let details;

        if (monthData) {
            calData = monthData.data;
            calDetails = monthData.details;

            dayData = _.has(calData, selectedDay) ? calData[selectedDay] : {};

            details = _.uniqBy(_.reject(_.map(dayData.detail_ids, (detail_id) => {
                return calDetails && calDetails[detail_id];
            }), _.isEmpty), (detail) => {
                if (detail.eid && detail.eid > 0) {
                    return [detail.eid, detail.type].join("$");
                }
                return [detail.desc, detail.type].join("$");
            });
        }

        let results = fromJS(details);
        let lastDate = null;
        let sortedResults;
        let dailyMap = {};

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

                let stamp = item.get('str');

                if (stamp && !_.isNumber(stamp)) {
                    stamp = DateTools.convertToBalboaTrunkTimestamp(esUtils.convertFromISO8601(stamp));
                }

                if (stamp > 0) {
                    date = DateTools.convertFromBalboaTrunkTimestamp(stamp);
                }

                if (date) {
                    formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);
                }

                if (!_.isEmpty(item.get('eid')) || item.get('type') === 'daily') {
                    // we only want to show one daily per day
                    if (item.get('type') === 'daily' && dailyMap[`${formattedDate}-${item.get('desc')}`] === item.get('desc')) {
                        return;
                    }

                    dailyMap[`${formattedDate}-${item.get('desc')}`] = item.get('desc');

                    data.push({
                        id: id += 1,
                        key: [item.get("eid"), item.get("type")].join("$"),
                        eid: item.get("eid"),
                        card: SearchResultCard,
                        props: {
                            formattedDate: (date ? formattedDate : null),
                            status: item.get('sta') || item.get('type') || '',
                            organization: item.get('desc'),
                            deliveryMethod: item.get('dm'),
                            city: item.get('vcty'),
                            state: item.get('vst'),
                            country: item.get('vcnt'),
                            dataEid: item.get('eid'),
                            disabled: (item.get('type') === 'daily')
                        }
                    });
                }
            });
        }
        // Only show 1 event per day...even if it has multiple stagetimes
        data = _.uniqBy(data, "key");
        return data;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            calendar: PropTypes.object.isRequired
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
        displayName: 'CalendarEventList',

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
                        let key = `calendar-event-${result.id}`;

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

export { CalendarEventListFactory }