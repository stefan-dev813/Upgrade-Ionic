/**
 * Creates PipelineCard React Component
 *
 * @param {object} spec - Container for named parameters
 * @returns {function} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const PipelineCardFactory = (spec) => {
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

    const {connect} = require('react-redux');

    // Material UI
    const ListItem = require('material-ui/List').ListItem;
    const Avatar = require('material-ui/Avatar').default;

    const mainTheme = require('../../theme/mainTheme').default;

    // Enums
    const VIEWS = require('../../enums/VIEWS').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        NavActionsFactory,
        SearchActionsFactory
    } = require('../../actions');

    /******************************************************************************
     *
     * Private Members
     *
     *****************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});

    const {
        changeMainView
    } = NavActionsFactory({});

    const {
        autoSearch
    } = SearchActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildAvatar;
    let _determineBackgroundColor;
    let _searchHandler;

    /**
     *
     * @param {object} inst
     * @returns {XML}
     * @private
     */
    _buildAvatar = (inst) => {
        const {pipelineData} = inst.props;

        return <Avatar
            backgroundColor={_determineBackgroundColor(inst)}>

            {pipelineData.get('qty')}

        </Avatar>;
    };

    /**
     *
     * @param inst
     * @private
     */
    _determineBackgroundColor = (inst) => {
        const {searchTerm} = inst.props;

        switch (searchTerm) {
            case 'pipeline:confirmed':
                return mainTheme.confirmedColor;
            case 'pipeline:held':
                return mainTheme.heldColor;
            case 'pipeline:lead':
                return mainTheme.leadColor;
        }

        return '';
    };

    /**
     *
     * @param searchTerm
     * @param inst
     * @private
     */
    _searchHandler = (searchTerm, inst) => {
        const {
            dispatch
        } = inst.props;

        if (searchTerm) {
            dispatch(autoSearch(searchTerm));

            dispatch(changeMainView(VIEWS.mainViews.SEARCH_VIEW));
        }
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            label: PropTypes.string.isRequired,
            searchTerm: PropTypes.string.isRequired,
            pipelineData: PropTypes.object.isRequired
        },
        propsPriority: [
            'label',
            'searchTerm',
            'pipelineData'
        ]
    });

    /******************************************************************************
     *
     * React / Public Interface
     *
     ****************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'PipelineCard',
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
                label,
                searchTerm,
                pipelineData
            } = this.props;

            return <ListItem
                leftAvatar={_buildAvatar(this)}
                primaryText={label}
                secondaryText={esUtils.format_currency(pipelineData.get('val'), 0)}
                onClick={(e) => {
                    stopProp(e);

                    _searchHandler(searchTerm, this);
                }}/>;
        }
    });

    return connect()(component);
}

export { PipelineCardFactory }