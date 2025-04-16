/**
 * Generates a ActivityList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ActivityListFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {ActivityCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {getText} = TranslateActionsFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    const ActivityCard = ActivityCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dashboard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface / React Component
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'ActivityList',

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
            const {dashboard, speakerInfo} = this.props;
            const activityList = dashboard.get('activity');
            let filteredList;

            if(activityList) {
                filteredList = activityList.filter((a) => {
                    if(speakerInfo && speakerInfo.selectedSpeaker && a && a.get('sids')) {
                        return a.get('sids').includes(speakerInfo.selectedSpeaker.get('sid'));
                    }
                });
            }

            if(!filteredList || !filteredList.size) {
                return <div></div>;
            }

            return <List>
                <SectionHeader label={getText('Recent Activity')}/>

                {filteredList ? filteredList.map((activity, i) => {
                    return <div key={`activity-${i}`}>
                        <ActivityCard
                            activity={activity}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ActivityListFactory }