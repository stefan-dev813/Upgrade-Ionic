/**
 * Creates a StoryCard React Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 *
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const StoryCardFactory = (spec) => {

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

    // Redux
    const {connect} = require('react-redux');

    // Factories
    const {ListCardFactory} = require('./ListCard');

    // Material UI
    const Checkbox = require('material-ui/Checkbox').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        mergeModifiedEvent
    } = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _completeHandler;
    let _generateCheckbox;

    /**
     *
     * @param {object} inst
     * @private
     */
    _completeHandler = (inst, value) => {
        const {
            dispatch,
            event,
            story
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const storiesToldString = modifiedEvent.get('storiesToldList') || '';
        let storiesToldList = storiesToldString.split('|');

        if (value && !_.includes(storiesToldList, story.get('id'))) {
            storiesToldList.push(story.get('id'));
        }
        else if (!value && _.includes(storiesToldList, story.get('id'))) {
            storiesToldList = _.filter(storiesToldList, (toldId) => {
                return toldId !== story.get('id');
            });
        }

        dispatch(mergeModifiedEvent({
            storiesToldList: storiesToldList.join('|')
        }));
    };

    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateCheckbox = (inst) => {
        const {event, story} = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const storiesToldString = modifiedEvent.get('storiesToldList') || '';
        const storiesToldList = storiesToldString.split('|');

        let matchedId = _.includes(storiesToldList, story.get('id').toString());

        return <Checkbox
            checked={matchedId}
            onCheck={(e, v) => {
                _completeHandler(inst, v);
            }}/>;
    };



    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            story: PropTypes.object.isRequired
        }
    });

    const CardMixin = CardMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'StoryCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, CardMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                story
            } = this.props;

            return <ListCard
                primaryText={story.get('ti') || story.get('name')}
                leftCheckbox={_generateCheckbox(this)}/>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StoryCardFactory }