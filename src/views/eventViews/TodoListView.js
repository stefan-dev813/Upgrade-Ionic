/**
 * Generates an TodoList Component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React component
 * @mixes AutoShouldUpdateMixin
 */
const TodoListViewFactory = (spec) => {
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
    const {
        connect
    } = require('react-redux');

    // Factories
    const {AddButtonFactory} = require('../../components/AddButton');
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {TodoListFactory} = require('../../components/list/TodoList');
    const {TodoListFormFactory} = require('../../forms/TodoListForm');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
        TodoActionsFactory,
        TranslateActionsFactory
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
        selectTodo
    } = TodoActionsFactory({});

    const {
        saveEvent,
        stopProp
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _addTodoHandler;
    let _submitHandler;

    /**
     *
     * @param inst
     * @private
     */
    _addTodoHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectTodo({
            id: '0'
        }));
    };

    /**
     * Handles the ActionListForm submission
     *
     * @param {object} form - Form values
     * @param {object} inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            event
        } = inst.props;
        const modifiedEvent = event.get('modifiedEvent');

        const mergedEvent = modifiedEvent.merge(form);

        saveEvent(mergedEvent);
    };

    /**********************************
     * Factories
     *********************************/

    const AddButton = AddButtonFactory({});
    const EventInfoCard = EventInfoCardFactory({});
    const TodoList = TodoListFactory({});
    const TodoListForm = TodoListFormFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Members
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'TodoListView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {

            let actions = [];

            actions.push({
                label: getText('Add Action'),
                iconClass: 'playlist-add-check',
                onClick: (e) => {
                    stopProp(e);

                    _addTodoHandler(this);
                }
            });

            return (
                <div>
                    <EventInfoCard/>

                    <TodoList/>

                    <TodoListForm
                        ref='todoListForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }
                    />

                    <AddButton actions={actions}/>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TodoListViewFactory }