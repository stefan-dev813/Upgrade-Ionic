/**
 * Generates a UpcomingConfirmedList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const UpcomingConfirmedListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

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
    const {SectionHeaderFactory} = require('../SectionHeader');
    const {UpcomingConfirmedCardFactory} = require('../cards');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const SectionHeader = SectionHeaderFactory({});
    const UpcomingConfirmedCard = UpcomingConfirmedCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dashboard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
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
        displayName: 'UpcomingConfirmedList',

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
            const upcomingList = dashboard.get('upcoming');
            let filteredList;

            if(upcomingList) {
                filteredList = upcomingList.filter((u) => {
                    if(speakerInfo && speakerInfo.selectedSpeaker && u && u.get('sids')) {
                        return u.get('sids').includes(speakerInfo.selectedSpeaker.get('sid'));
                    }
                });
            }

            if(!filteredList || !filteredList.size) {
                return <div></div>;
            }

            return <List>
                <SectionHeader>{getText('Upcoming Confirmed')}</SectionHeader>

                {filteredList ? filteredList.map((item, i) => {
                    return <div key={`activity-${i}`}>
                        <UpcomingConfirmedCard
                            item={item}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { UpcomingConfirmedListFactory }