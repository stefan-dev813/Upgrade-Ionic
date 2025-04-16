/**
 * Generates the Event Actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const TodoActionsFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Actions
    const EventActionsFactory = require('./EventActions').default;

    /**********************************************************************
     *
     * Private Members
     *
     *********************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {extractSelectedItem} = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _deleteTodo;
    let _extractSelectedTodo;
    let _getUndo;
    let _saveTodo;
    let _selectTodo;
    let _setUndo;

    /**
     *
     * @param data
     * @private
     */
    _deleteTodo = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_DELETE_TODO,
            payload: data
        };
    };

    /**
     *
     * @param event
     * @returns {Record|null}
     * @private
     */
    _extractSelectedTodo = (event) => {
        return extractSelectedItem(event, 'selectedTodo', 'EventTodo');
    };

    /**
     *
     * @param {Record} todo
     * @param {Record|ViewModel} view
     * @returns {Record}
     * @private
     */
    _getUndo = (todo, view) => {
        const todoView = view.get('todoView');
        if (_.has(todoView, ["get"])) {

            const todoUndo = todoView.get('todoUndo');

            return todoUndo.get(todo.get('id'));
        }
        return todo;
    };

    /**
     * Adds or Saves a Todo to the existing collection, unpersisted with server
     *
     * @param data
     * @private
     */
    _saveTodo = (data) => {
        return {
            type: RADIOS.stores.EVENT_STORE_SAVE_TODO,
            payload: data
        };
    };

    /**
     * Updates the store with the selected Todo object and navigates to the subview
     *
     * @param {object} data
     * @private
     */
    _selectTodo = (data) => {
        return [
            {
                type: RADIOS.stores.EVENT_STORE_SELECT_TODO,
                payload: data
            },
            {
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: VIEWS.subViews.TODO_VIEW
            }
        ];
    };

    /**
     *
     * @param data
     * @private
     */
    _setUndo = (data) => {
        return {
            type: RADIOS.stores.VIEW_STORE_TODO_SET_UNDO,
            payload: data
        };
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        deleteTodo: _deleteTodo,
        extractSelectedTodo: _extractSelectedTodo,
        getUndo: _getUndo,
        saveTodo: _saveTodo,
        selectTodo: _selectTodo,
        setUndo: _setUndo
    };
}

export default TodoActionsFactory;
