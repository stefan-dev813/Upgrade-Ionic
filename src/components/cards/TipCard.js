/**
 * Generates a TripCard component.
 *
 * @param {object} spec
 * @returns {object}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const TipCardFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Redux
    const {
        connect
    } = require('react-redux');

    // Components
    const {ListCardFactory} = require('../cards/ListCard');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    const ListCard = ListCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _actionTipOfTheDay;

    /**
     *
     * @param {Record} tip
     * @private
     */
    _actionTipOfTheDay = (tip) => {
        if (tip && tip.get('link')) {
            window.open(tip.get('link'), '_system');
        }
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'TipCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                displayData
            } = this.props;

            // just the tip
            const tip = displayData && displayData.get('displayLists') && displayData.get('displayLists').get('tip');

            if (!tip) {
                return null;
            }

            return (
                <div className="quote">
                    <SectionHeader label={getText('Tip of the Day')}/>

                    <p onClick={(e) => {
                        stopProp(e);

                        _actionTipOfTheDay(tip);
                    }}>
                        {tip.get('tiptext').trim()}
                    </p>

                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TipCardFactory }