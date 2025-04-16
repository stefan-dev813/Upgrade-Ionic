/**
 * Generates a TodoList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const TodoListFactory = (spec) => {
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
    const {TodoCardFactory} = require('../cards');
    const {ViewHeaderFactory} = require('../ViewHeader');
    const {SectionHeaderFactory} = require('../SectionHeader');

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

    const ViewHeader = ViewHeaderFactory({});
    const TodoCard = TodoCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dashboard: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            canComplete: PropTypes.bool
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
        displayName: 'TodoList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once and cached when the class is created. Values in
         * the mapping will be set on this.props if that prop is not
         * specified by the parent component
         *
         * @returns {object}
         */
        getDefaultProps() {
            return {
                canComplete: true
            };
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {canComplete, dashboard, event, speakerInfo} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            let todoList;
            let filteredList;

            if (canComplete) {
                todoList = modifiedEvent.get('EventTodo');
                filteredList = todoList;
            } else {
                todoList = dashboard.get('todoList');

                if(todoList) {
                    filteredList = todoList.filter((t) => {
                        if(speakerInfo && speakerInfo.selectedSpeaker && t && t.get('sids')) {
                            return t.get('sids').includes(speakerInfo.selectedSpeaker.get('sid'));
                        }
                    });
                }
            }

            if(!filteredList || !filteredList.size) {
                return <div></div>;
            }

            return <List>
                {canComplete ? <ViewHeader>{getText('Action List')}</ViewHeader> : <SectionHeader>{getText('Action List')}</SectionHeader>}

                {filteredList ? filteredList.map((todo, i) => {
                    return <div key={`todo-${i}`}>
                        <TodoCard
                            canComplete={canComplete}
                            todo={todo}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TodoListFactory }