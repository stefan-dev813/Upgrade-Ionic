/**
 * Generates a StoryList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const StoryListFactory = (spec) => {
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
    const {StoryCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    const {
        isSolutionTree
    } = require('../../util/Platform').default;

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
     * Methods
     *********************************/

    let _generateStoriesTold;

    /**
     *
     * @param inst
     * @private
     */
    _generateStoriesTold = (inst) => {
        const {
            displayData,
            event,
            speakerInfo
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        let storyList = selectedSpeaker.get('stories');

        const specificContentAreas = displayData.get('displayLists').get('universal').get('specific_content_areas');

        if (isSolutionTree() && specificContentAreas) {
            storyList = specificContentAreas.toArray();
        }

        return storyList;
    };

    /**********************************
     * Components
     *********************************/

    const SectionHeader = SectionHeaderFactory({});
    const StoryCard = StoryCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
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
        displayName: 'StoryList',

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
            const storyList = _generateStoriesTold(this);

            return <List>
                <SectionHeader>{(isSolutionTree() ? getText('Specific Content Areas') : getText('Stories / Jokes Told'))}</SectionHeader>

                {storyList ? storyList.map((story, i) => {
                    return <div key={`story-${i}`}>
                        <StoryCard
                            story={story}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StoryListFactory }